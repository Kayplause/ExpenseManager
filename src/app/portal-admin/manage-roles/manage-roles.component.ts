import { NgForm } from '@angular/forms';
import { AddtabReq } from './../../request-objects/addtab-req';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { PortalmgtService } from '../../services/portalmgt.service';
import { LoadrolesReq } from '../../request-objects/loadroles-req';
import { AddroleReq } from '../../request-objects/addrole-req';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class ManageRolesComponent implements OnInit {
  portalRoleId: number;
  portalRoleDB = new LoadrolesReq();
  portalRole = new AddroleReq();
  portalRoles: any[]; // variable to hold DB roles
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  transactionMsg: string; // variable to hold response message
  deleteInit: boolean; // variable to determine delete view type
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count

  constructor(private generalService: GeneralService, private portalService: PortalmgtService) { }

  ngOnInit() {
    this.loading = true;
    this.loadPortalRoles();
    this.paginator.num = 10;
  }

  loadPortalRoles() {
    this.portalRoleDB.UserId = this.generalService.activeUser.UserId;
    this.portalRoleDB.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalService.getRoles(this.portalRoleDB).subscribe(
      resp => {
        this.loading = false;
        this.portalRoles = resp.body.Roles.sort(function (a, b) { // sort descending by Id
          if (a.RoleId < b.RoleId) {
            return -1;
          }
          if (a.RoleId > b.RoleId) {
            return 1;
          }
          return 0;
        });
      }
    );
  }

  displayPeriod() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  toPascalCase(string) {
    const tabArr = string.split(' ');
    let pascalCasedTab = '';
    for (let i = 0; i < tabArr.length; i++) {
      const firstLetter = tabArr[i].substr(0, 1);
      const otherLetters = tabArr[i].substr(1);
      const newWord = firstLetter.toUpperCase() + otherLetters;
      pascalCasedTab += newWord;
    }
    return pascalCasedTab;
  }

  triggerAdd() { // add user modal is triggered
    this.portalRole = new AddroleReq();
    this.portalRoleId = null;
    this.responseAlert = false;
    this.transactionMsg = 'New role has been successfully created';
  }

  triggerEdit(id) { // edit user modal is triggered
    this.portalRoleId = id;
    this.portalRole = this.portalRoles.filter((role) => role.RoleId === id)[0];
    this.responseAlert = false;
    this.transactionMsg = 'Role has been successfully updated';
  }

  triggerDelete(id) { // delete user modal is triggered
    this.portalRoleId = id;
    this.portalRole = this.portalRoles.filter((role) => role.RoleId === id)[0];
    this.responseAlert = false;
    this.transactionMsg = 'Role has been successfully deleted';
    this.deleteInit = true;
  }

  onAddPortalRole(form: NgForm) {
    this.responseAlert = false; // hide error message if any while processing form
    this.working = true; // prevent further data input in form field
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.portalRole.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalRole.Name = this.toPascalCase(this.portalRole.Name);

    this.portalService.addRole(this.portalRole).subscribe(
      resp => {
        this.processServerResponse(resp, form);
      },
      err => {
        this.servedRequest(err.statusText);
      }
    );
  }

  onEditPortalRole(form: NgForm) {
    const data = {
      SysPathCode: this.generalService.activeUser.AuthToken,
      RoleId: this.portalRoleId,
      Name: this.toPascalCase(this.portalRole.Name)
    };
    this.responseAlert = false;
    this.working = true;
    this.stateA = 'out';
    this.stateB = 'in';

    this.portalService.modifyRole(data).subscribe(
      resp => {
        this.processServerResponse(resp);
      },
      err => {
        this.servedRequest(err.statusText);
      }
    );
  }

  onDeletePortalRole() {
    const data = {
      SysPathCode: this.generalService.activeUser.AuthToken,
      RoleId: this.portalRoleId,
    };
    this.responseAlert = false;
    this.working = true;
    this.stateA = 'out';
    this.stateB = 'in';

    this.portalService.deleteRole(data).subscribe(
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
      this.servedRequest(this.transactionMsg);
      this.loadPortalRoles(); // reload all portal roles
      this.requestPass = true; // transaction was successful: alert success
      if (form) {
        this.formReset(form); // reset the form and re-init the portalrole request object
      }
      this.displayPeriod(); // timeout
      this.deleteInit = false; // ...when a role is deleted
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
    this.portalRole = new AddroleReq();
  }

  formHasUnsavedData() {
    if (this.portalRoleId === null) {
      if (this.portalRole.Name) { return true; }
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
