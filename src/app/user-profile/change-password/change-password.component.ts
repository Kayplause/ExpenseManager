import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, group, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Promise } from 'q';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../services/login.service';
import { GeneralService } from './../../services/general.service';
import { PasschangeReq } from './../../request-objects/passchange-req';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition( 'in => out', animate('1ms', style( { transform: 'translateX(-50px)' }) ) ),
      transition( 'out => in', animate('100ms', style( { transform: 'translateX(-50px)' }) ) )
    ])
  ]
})
export class ChangePasswordComponent implements OnInit {

  passchange = new PasschangeReq();
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  inputTypeA: string; // holds form field input type -- old password
  inputTypeB: string; // holds form field input type -- new password

  constructor(private loginService: LoginService, private generalService: GeneralService) { }

  ngOnInit() {
    this.inputTypeA = this.inputTypeB = 'password';
  }

  displayPeriod() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  viewPassword(field) {
    if (field === 'old' && this.passchange.OldPassword) {
      this.inputTypeA = this.inputTypeA === 'text' ? 'password' : 'text';
    }
    if (field === 'new' && this.passchange.NewPassword) {
      this.inputTypeB = this.inputTypeB === 'text' ? 'password' : 'text';
    }
  }

  onSubmit(form: NgForm) {
    this.responseAlert = false; // hide error message if any while processing form
    this.working = true; // prevent further data input in form field
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.passchange.Username = this.generalService.activeUser.Username;
    this.passchange.SysPathCode = this.generalService.activeUser.AuthToken;

    this.loginService.changePassword(this.passchange).subscribe(
      resp => {
      this.processServerResponse(resp, form);
      },
      err => {
        this.servedRequest(err.statusText);
      }
    );
  }

  processServerResponse(resp, form) {
    const response = resp.body;
    if (response.Status === null) {
      this.formReset(form); // reset the form and re-init the pass change request object
      this.servedRequest('Unknown error occured from the server');
    }
    if (response.Status.IsSuccessful === false) {
      this.formReset(form); // reset the form and re-init the pass change request object
      this.servedRequest(response.Status.Message.FriendlyMessage);
    }
    if (response.Status.IsSuccessful === true) {
      this.servedRequest('Password change was successful');
      this.requestPass = true; // pass change was successful: alert success
      this.formReset(form); // reset the form and re-init the pass change request object
      this.displayPeriod();
      if (this.generalService.activeUser.IsFirstTimeAccess === true) {
        this.generalService.logout(); // first time user should re-login
      }
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
    this.passchange = new PasschangeReq();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (window.sessionStorage.getItem('sE')) {
      return true;
    }
    if (this.passchange.OldPassword || this.passchange.NewPassword) {
    // user has touched the form but not submitted or has submitted but update failed:
      return window.confirm('You have unsaved changes! Are you sure you want to leave this page?');
    }
    return true;
  }

}
