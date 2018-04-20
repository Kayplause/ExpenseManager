import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { GeneralService } from './../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class EditProfileComponent implements OnInit {

  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query

  constructor(public generalService: GeneralService, private loginService: LoginService) { }

  ngOnInit() {
  }

  displayPeriod() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  onEditProfile(form: NgForm) {
    const data = form.value;
    this.responseAlert = false;
    this.working = true;
    this.stateA = 'out';
    this.stateB = 'in';

    console.log(data);
    alert(this.loginService.editProfile(data).message);

    // this.loginService.editProfile(data).subscribe(
    //   resp => {
    //     this.processServerResponse(resp, form);
    //   },
    //   err => {
    //     this.servedRequest(err.statusText);
    //   }
    // );
  }

  processServerResponse(resp, form) {
    const response = resp.body;
    if (response === null) {
      this.servedRequest('Unknown error occured from the server');
    }
    if (response.IsSuccessful === false) {
      this.servedRequest(response.Message.FriendlyMessage);
    }
    if (response.IsSuccessful === true) {
      this.servedRequest('Transaction was successfully completed');
      this.requestPass = true; // transaction was successful: alert success
      this.formReset(form); // reset the form and re-init the portaluser request object
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
  }

  formHasUnsavedData() {
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
