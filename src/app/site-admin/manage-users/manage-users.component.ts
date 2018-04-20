import { AddusertoroleReq } from './../../request-objects/addusertorole-req';
import { LoadrolesReq } from './../../request-objects/loadroles-req';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { GeneralService } from './../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AddportaluserReq } from '../../request-objects/addportaluser-req';
import { UsermgtService } from './../../services/usermgt.service';
import { LoadportalusersReq } from './../../request-objects/loadportalusers-req';
import { PortalmgtService } from '../../services/portalmgt.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class ManageUsersComponent implements OnInit {

  portalUser = new AddportaluserReq();
  allPortalUsers = new LoadportalusersReq();
  portalUsers: any[]; // stores all DB portal users
  roles: any[]; // list of all DB roles
  portalUserId: number; // holds the activated portal user for e.g edit or delete
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  inputType: string; // holds form field input type
  loading: boolean; // indicates loading process
  transactionMsg: string; // message to display on request completion
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
  userDBRoles = []; // list of user's DB roles
  userRoles = []; // list of user roles
  delUserRoles = []; // user roles to remove

  constructor(
    private generalService: GeneralService,
    private userService: UsermgtService,
    private portalService: PortalmgtService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.inputType = 'password';
    this.loadPortalUsers();
    this.loadRoles();
    this.paginator.num = 10;
  }

  loadPortalUsers() {
    this.allPortalUsers.SysPathCode = this.generalService.activeUser.AuthToken;
    this.userService.getUsers(this.allPortalUsers).subscribe(
      resp => {
        this.loading = false;
        if (resp.body.Users) {
          this.portalUsers = resp.body.Users.sort(function (a, b) { // sort descending by Id
            if (a.UserId < b.UserId) {
              return -1;
            }
            if (a.UserId > b.UserId) {
              return 1;
            }
            return 0;
          });
        }
      }
    );
  }

  loadRoles() {
    const reqObj = new LoadrolesReq();
    reqObj.UserId = this.generalService.activeUser.UserId;
    reqObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalService.getRoles(reqObj).subscribe(
      resp => {
        const hiddenRoles = [1, 2];
        this.roles = resp.body.Roles.filter(role => hiddenRoles.indexOf(role.RoleId) === -1);
      }
    );
  }

  displayPeriod() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  viewPassword() {
    if (this.portalUser.Password) {
      this.inputType = this.inputType === 'text' ? 'password' : 'text';
    }
  }

  triggerRoleMgt(id) { // role mgt modal is triggered
    this.userRoles = [];
    this.delUserRoles = [];
    this.portalUserId = id;
    this.portalUser = this.portalUsers.filter(user => user.UserId === id)[0];
    this.transactionMsg = `User's role has been successfully updated`;
    const userRoles = this.portalUser['Roles'];
    userRoles.map((v, k) => {
      this.userDBRoles.push(v.RoleId);
      this.userRoles.push(v.RoleId);
    });
  }

  isChecked(id) {
    if (this.userRoles.indexOf(id) > -1) {
      return true;
    }
    return false;
  }

  roleCheck(e, id) {
    if (e.target.checked === true) {
      this.userRoles.push(id);
      const pos = this.delUserRoles.indexOf(id);
      if (pos > -1) {
        this.delUserRoles.splice(pos, 1);
      }
    } else {
      const pos = this.userRoles.indexOf(id);
      this.userRoles.splice(pos, 1);
      if (this.userDBRoles.indexOf(id) > -1 ) {
        this.delUserRoles.push(id);
      }
    }
  }

  onAddRoleToUser() {
    const reqObj = new AddusertoroleReq();
    reqObj.SysPathCode = this.generalService.activeUser.AuthToken;
    reqObj.UserId = this.portalUserId;
    if (this.delUserRoles.length > 0) {
      reqObj.RoleIds = this.delUserRoles.join(',');
      this.userService.removeUserRole(reqObj).subscribe(
        res => {
          //
        }
      );
    }
    reqObj.RoleIds = this.userRoles.join(',');
    this.userService.addUserToRole(reqObj).subscribe(
      resp => {
        this.processServerResponse(resp);
      },
      err => {
        this.servedRequest(err.StatusText);
      }
    );
  }

  triggerAdd() { // add user modal is triggered
    this.portalUserId = null;
    this.portalUser = new AddportaluserReq();
    this.responseAlert = false;
    this.transactionMsg = 'New user has been successfully added';
  }

  triggerEdit(id) { // edit user modal is triggered
    this.portalUserId = id;
    this.portalUser = this.portalUsers.filter((user) => user.UserId === id)[0];
    this.responseAlert = false;
    this.transactionMsg = 'User information has been successfully updated';
  }

  triggerDelete(id) { // delete user modal is triggered
    this.portalUserId = id;
    this.portalUser = this.portalUsers.filter((user) => user.UserId === id)[0];
    this.responseAlert = false;
    this.transactionMsg = 'User information has been successfully deleted';
  }

  onAddPortalUser(form: NgForm) {
    this.responseAlert = false; // hide error message if any while processing form
    this.working = true; // prevent further data input in form field
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.portalUser.SysPathCode = this.generalService.activeUser.AuthToken;
    this.portalUser.IsApproved = false;

    this.userService.addUser(this.portalUser).subscribe(
      resp => {
        this.processServerResponse(resp, form);
      },
      err => {
        this.servedRequest(err.statusText);
      }
    );
  }

  onEditPortalUser(form: NgForm) {
    const data = {
      SysPathCode: this.generalService.activeUser.AuthToken,
      UserId: this.portalUserId,
      FullName: form.value.FullName,
      Email: form.value.Email,
      IsApproved: true,
      AdminUserId: 0
    };
    this.responseAlert = false;
    this.working = true;
    this.stateA = 'out';
    this.stateB = 'in';

    this.userService.modifyUser(data).subscribe(
      resp => {
        this.processServerResponse(resp);
      },
      err => {
        this.servedRequest(err.statusText);
      }
    );
  }

  onDeletePortalUser() {
    alert('Sorry, this function is unavailable at the moment');
  }

  processServerResponse(resp, form?) {
    const response = resp.body.Status ? resp.body.Status : resp.body;
    if (response === null) {
      this.servedRequest('Unknown error occured from the server');
    }
    if (response.IsSuccessful === false) {
      this.servedRequest(response.Message.FriendlyMessage);
    }
    if (response.IsSuccessful === true) {
      this.servedRequest(this.transactionMsg);
      this.loadPortalUsers(); // reload all portal users
      this.requestPass = true; // transaction was successful: alert success
      form ? this.formReset(form) : this.portalUser = new AddportaluserReq(); // reset the form and userObject
      this.displayPeriod(); // timeout
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
    this.portalUser = new AddportaluserReq();
  }

  formHasUnsavedData() {
    if (this.portalUserId === null) {
      if (
        this.portalUser.Fullname ||
        this.portalUser.Username ||
        this.portalUser.Email ||
        this.portalUser.Password
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
