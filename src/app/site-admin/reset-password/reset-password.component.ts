import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, group, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Promise } from 'q';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../services/login.service';
import { GeneralService } from './../../services/general.service';
import { PassresetReq } from './../../request-objects/passreset-req';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class ResetPasswordComponent implements OnInit {

  passreset = new PassresetReq();
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query

  constructor(private loginService: LoginService, private generalService: GeneralService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.responseAlert = false; // hide error message if any while processing form
    this.working = true; // prevent further data input in form field
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.passreset.SysPathCode = this.generalService.activeUser.AuthToken;

    this.loginService.resetPassword(this.passreset).subscribe(
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
      this.servedRequest('Unknown error occured from the server');
    }
    if (response.Status.IsSuccessful === false) {
      this.servedRequest(response.Status.Message.FriendlyMessage);
    }
    if (response.Status.IsSuccessful === true) {
      this.servedRequest(
        `Password change was successful<br>New Password: <b>${response.NewPassword}</b>`
      );
      this.requestPass = true; // pass change was successful: alert success
      this.formReset(form); // reset the form and re-init the pass reset request object
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
    this.passreset = new PassresetReq();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (window.sessionStorage.getItem('sE')) {
      return true;
    }
    if (this.passreset.Username) {
      // user has touched the form but not submitted or has submitted but update failed:
      return window.confirm('You have unsaved changes! Are you sure you want to leave this page?');
    }
    return true;
  }

}
