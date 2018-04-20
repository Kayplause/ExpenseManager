import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AddtabReq } from './../../request-objects/addtab-req';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { PortalmgtService } from '../../services/portalmgt.service';
import { LoadrolesReq } from '../../request-objects/loadroles-req';

@Component({
  selector: 'app-manage-tabs',
  templateUrl: './manage-tabs.component.html',
  styleUrls: ['./manage-tabs.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class ManageTabsComponent implements OnInit {
  portalTabId: number;
  portalTab = new AddtabReq();
  portalRole = new LoadrolesReq();
  portalTabs: any[]; // variable to hold DB tabs
  parentTabs: any[]; // variable to hold parent tab types
  portalRoles: any[]; // variable to hold DB roles
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  partPass: boolean; // indicates partially successful user query
  hideForm: boolean; // hide the form if tab and angular component creation was successful
  loading: boolean; // indicates loading process
  transactionType: string; // variable to hold type of transaction
  deleteInit: boolean; // variable to determine delete view type
  unUpdated: boolean; // variable to determine when to manually reload tabs
  tabRoles = []; // variable to hold user selected roles - new setting
  tabRolesDB = []; // variable to hold user selected roles - already set
  oldRoute = ''; // this holds the old contentUrl for change purpose
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
  defaultTabs = [
    'Dashboard', 'Portal Admin', 'Role Management', 'Site Admin',
    'User Management', 'Tab Management', 'Password Reset'
  ];

  constructor(
    private generalService: GeneralService,
    private portalService: PortalmgtService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadPortalRoles();
    this.loadPortalTabs();
    this.paginator.num = 10;
  }

  loadPortalTabs() {
    this.portalTab.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalService.getTabs(this.portalTab).subscribe(
      resp => {
        this.loading = false;
        if (resp.body.Tabs) {
          this.tabGrid(resp.body.Tabs);
        }
      }
    );
  }

  tabGrid(DBTABS) { // list of tabs display
    const tabsDB = DBTABS;
    this.parentTabs = tabsDB.filter(tab => tab.TabParentId === 0);
    tabsDB.map((value, index) => {
      value.TabParentNameObj = tabsDB.filter(tab => tab.TabId === value.TabParentId)[0];
      value.TabParentName = value.TabParentNameObj ? value.TabParentNameObj['Title'] : '--';
    });
    this.portalTabs = tabsDB.sort(function (a, b) { // sort descending by Id
      if (a.TabId < b.TabId) {
        return -1;
      }
      if (a.TabId > b.TabId) {
        return 1;
      }
      return 0;
    });
  }

  loadPortalRoles() {
    this.portalRole.UserId = this.generalService.activeUser.UserId;
    this.portalRole.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalService.getRoles(this.portalRole).subscribe(
      resp => {
        this.portalRoles = resp.body.Roles;
      }
    );
  }

  displayPeriod() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  triggerAdd() { // add tab modal is triggered
    this.portalTab = new AddtabReq();
    this.tabRoles = [];
    this.portalTabId = null;
    this.responseAlert = false;
    this.transactionType = 'create';
    this.hideForm = false; // show the form
  }

  triggerEdit(id) { // edit tab modal is triggered
    this.portalTabId = id;
    this.portalTab = this.portalTabs.filter((tab) => tab.TabId === id)[0];
    this.responseAlert = false;
    this.transactionType = 'edit';
    const tabRolesDB = this.portalTab.Roles;
    this.tabRolesDB = tabRolesDB.split(',');
    this.tabRoles = this.tabRolesDB;
    this.oldRoute = this.portalTab.ContentUrl;
    this.hideForm = false; // show the form
  }

  triggerDelete(id) { // delete tab modal is triggered
    this.portalTabId = id;
    this.portalTab = this.portalTabs.filter((tab) => tab.TabId === id)[0];
    this.responseAlert = false;
    this.transactionType = 'delete';
    this.deleteInit = true;
  }

  isChecked(role) {
    if (this.tabRolesDB.indexOf(role) !== -1) {
      return true;
    }
    return false;
  }

  selectedRoles(event, name) {
    const tabRoles = this.tabRoles;
    const isChecked = event.target.checked;
    if (isChecked === true) {
      tabRoles.push(name);
      this.tabRoles = tabRoles;
    }
    if (isChecked === false) {
      this.tabRoles = tabRoles.filter(role => role !== name);
    }
  }

  processSelectedRoles(rolesArr) {
    const roles = rolesArr.filter(role => role === '*');
    if (roles.length > 0) {
      return '*';
    }
    return rolesArr.join(',');
  }

  addEditFun() {
    this.responseAlert = false; // hide error message if any while processing form
    this.working = true; // prevent further data input in form field
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.portalTab.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalTab.TabType = this.portalTab.TabParentId === 0 ? 1 : 3;
    this.portalTab.Roles = this.processSelectedRoles(this.tabRoles);
  }

  directoryFun() {
    if (this.portalTab.TabParentId > 0) {
      const parent = this.parentTabs.filter(tab => tab.TabId === parseFloat(this.portalTab.TabParentId))[0];
      let directory = parent['ContentUrl'];
      if (parent['Title'] === 'Dashboard') {
        directory = 'dashboard';
      }
      if (parent['Title'] === 'Portal Admin') {
        directory = 'portal-admin';
      }
      if (parent['Title'] === 'Site Admin') {
        directory = 'site-admin';
      }
      return directory;
    } else {
      return '';
    }
  }

  tabIsEditable(tab): boolean {
    const stat = this.defaultTabs.find((elem) => {
      return tab === elem;
    });
    if (stat !== undefined) {
      return false;
    }
    return true;
  }

  onAddPortalTab(form: NgForm) {
    if (this.tabRoles.length < 1) {
      this.servedRequest('Please select role(s)');
    }
    if (this.tabRoles.length > 0) {
      this.addEditFun();
      this.portalService.addTab(this.portalTab).subscribe(
        resp => {
          this.processServerResponse(resp, form);
        },
        err => {
          this.servedRequest(err.statusText);
        }
      );
    }
  }

  onEditPortalTab(form: NgForm) {
    if (!this.tabIsEditable(this.portalTab.Title)) {
      alert('Default tabs cannot be edited');
      return;
    }
    if (this.tabRoles.length < 1) {
      this.servedRequest('Please select role(s)');
    }
    if (this.tabRoles.length > 0) {
      this.addEditFun();
      this.portalTab.TabId = this.portalTabId;
      this.portalService.modifyTab(this.portalTab).subscribe(
        resp => {
          this.processServerResponse(resp);
        },
        err => {
          this.servedRequest(err.statusText);
        }
      );
    }
  }

  onDeletePortalTab() {
    if (!this.tabIsEditable(this.portalTab.Title)) {
      alert('Default tabs cannot be deleted');
      return;
    }
    const childrenTabs = this.portalTabs.filter(tab => tab.TabParentId === this.portalTabId);
    if (childrenTabs.length > 0) {
      this.servedRequest('Tab has child(ren) tabs');
      return;
    }
    const data = {
      SysPathCode: this.generalService.activeUser.AuthToken,
      TabId: this.portalTabId,
      AdminUserId: 0
    };
    this.responseAlert = false;
    this.working = true;
    this.stateA = 'out';
    this.stateB = 'in';

    this.portalService.deleteTab(data).subscribe(
      resp => {
        this.processServerResponse(resp);
      },
      err => {
        this.servedRequest(err.statusText);
      }
    );
  }

  processServerResponse(resp, form?) {
    const response = resp.body.Status ? resp.body.Status : resp.body;
    if (response === null) {
      this.servedRequest('Unknown error occured from the server');
    }
    if (response.IsSuccessful === false) {
      this.servedRequest(response.Message.TechnicalMessage);
    }
    if (response.IsSuccessful === true) {
      const tabAction = this.transactionType;
      const newTabName = this.portalTab.ContentUrl;
      const oldTabName = this.oldRoute;
      const dir = this.directoryFun();
      const tabUrl =
        `http://localhost:4000/tabMgt/${tabAction}?dir=${dir}&newurl=${newTabName}&oldurl=${oldTabName}`;
      /* --------------------------------------------------------------------
              Attempt angular component creation, delete as well as
              app.module and routing.module file import statements
      -----------------------------------------------------------------------*/
      this.http.get(tabUrl).subscribe(
        res => {
          if (res === 'Voila') { // SUCCESS
            this.angularComponentSuccess(tabAction);
          }
          if (res !== 'Voila') {
            this.angularComponentErr(tabAction);
          }
        },
        err => {
          this.angularComponentErr(tabAction);
        }
      );
      form ? this.formReset(form) : this.portalTab = new AddtabReq(); // reset Form and tabObject
      this.tabRoles = []; // reset roles array
    }
  }

  servedRequest(msg) {
    this.working = false;
    this.stateA = 'in';
    this.stateB = 'out';
    this.responseAlert = true;
    this.requestPass = false;
    this.responseMessage = msg;
  }

  formReset(form) {
    form.reset();
    this.portalTab = new AddtabReq();
  }

  angularComponentErr(tabAction) {
    let transactionMsg = '';
    if (tabAction === 'create') {
      transactionMsg = 'New tab creation was successfully registered but component creation failed';
    }
    if (tabAction === 'edit') {
      transactionMsg = 'Tab modification was successfully registered but angular routing file update failed';
    }
    if (tabAction === 'delete') {
      transactionMsg = 'Tab deletion was successfully registered but angular files update failed';
      this.deleteInit = false; // ...when a tab is deleted
    }
    this.hideForm = true; // hide the form
    this.servedRequest(transactionMsg);
    this.requestPass = null;
    this.partPass = true; // transaction was partially successful: alert warning
    this.loadPortalTabs(); // reload portal tabs
    this.unUpdated = true;
  }

  angularComponentSuccess(tabAction) {
    let transactionMsg = '';
    if (tabAction === 'create') {
      transactionMsg = 'Tab creation was successful';
    }
    if (tabAction === 'edit') {
      transactionMsg = 'Tab modification was successful';
    }
    if (tabAction === 'delete') {
      transactionMsg = 'Tab deletion was successful';
      this.deleteInit = false; // ...when a tab is deleted
    }
    this.servedRequest(transactionMsg);
    this.requestPass = true; // transaction was successful: alert success
    this.displayPeriod(); // timeout
    this.refreshAppTabs(); // reload the tab links
  }

  refreshAppTabs() {
    this.portalTab.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalService.getTabs(this.portalTab).subscribe(
      resp => {
        if (resp.body.Tabs) {
          this.tabGrid(resp.body.Tabs);
          // tabs management
          const user = JSON.parse(window.sessionStorage.getItem('ls'));
          user.Tabs = resp.body.Tabs;
          window.sessionStorage.setItem('ls', JSON.stringify(user));
          this.generalService.organizeDBTabs();
          window.location.reload();
        }
      }
    );
  }

  formHasUnsavedData() {
    if (this.portalTabId === null) {
      if (
        this.portalTab.Title ||
        this.portalTab.ContentUrl ||
        this.portalTab.TabParentId ||
        this.portalTab.Roles
      ) { return true; }
    }
    return false;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (window.sessionStorage.getItem('sE')) {
      return true;
    }
    if (this.formHasUnsavedData()) {
      // user has touched the form but not submitted or has submitted but update failed:
      return window.confirm('You have unsaved changes! Are you sure you want to leave this page?');
    }
    return true;
  }

}
