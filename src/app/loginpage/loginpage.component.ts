import { HeaderService } from './../services/header.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { LoginReq } from './../request-objects/login-req';
import { GeneralService } from './../services/general.service';
import { trigger, transition, state, style, animate, group } from '@angular/animations';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out',
        group([
          // animate('300ms', style({ opacity: 0.5, width: '10px' })),
          // animate('200ms', style({ transform: 'translateX(-50px)' })),
          animate('1ms', style({ transform: 'translateX(-50px)' })),
        ])
      ),
      transition('out => in',
        group([
          animate('100ms', style({ transform: 'translateX(-50px)' })),
          // animate('200ms', style({ transform: 'translateX(50px)' })),
          // animate('300ms', style({ width: '*'}))
        ])
      )
    ])
  ]
})
export class LoginpageComponent implements OnInit {

  login: LoginReq = { Password: '', Username: '', SourceIP: '' };
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query

  constructor(
    private generalService: GeneralService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.generalService.isLoggedIn === true) { // user is logged in but tries to visit login page:
      if (this.generalService.activeUser.IsFirstTimeAccess === true) { // is first time user
        this.router.navigate(['/home']);
      }
      if (this.generalService.activeUser.IsFirstTimeAccess === false) { // is returning user
        this.router.navigate(['/dashboard']);
      }
    }
    this.working = false;
  }

  onSubmit() {
    this.responseAlert = false; // hide error message if any while processing form
    this.working = true; // prevent further data input in form field
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.loginService.login(this.login).subscribe(
      resp => {
        this.processServerResponse(resp);
      },
      err => {
        this.failedRequest(err.statusText);
      }
    );
  }

  processServerResponse(resp) {
    const response = resp.body;
    if (response.Status === null) {
      this.failedRequest('Unknown error occured from the server');
      return;
    }
    if (response.Status.IsSuccessful === false) {
      this.failedRequest(response.Status.Message.FriendlyMessage);
      return;
    }
    if (response.Status.IsSuccessful === true) {
      this.storeData(response);
      this.generalService.organizeDBTabs();
      this.navigateUser(response);
      return;
    }
  }

  failedRequest(msg) {
    this.working = false;
    this.stateA = 'in';
    this.stateB = 'out';
    this.responseAlert = true;
    this.requestPass = false;
    this.responseMessage = msg;
    this.login.Password = null;
  }

  storeData(response) {
    window.sessionStorage.setItem('ls', JSON.stringify(response)); // necessary to retain user params on e.g page reload
    this.generalService.activeUser = response;
    window.sessionStorage.removeItem('sE');
    this.generalService.sessionExpired = false;
  }

  navigateUser(response) {
    this.generalService.isLoggedIn = true;
    // First time User
    if (response.IsFirstTimeAccess === true) {
      this.router.navigate(['/home']);
    }
    // Returning User
    if (response.IsFirstTimeAccess === false) {
      this.router.navigate(['/dashboard']);
    }
  }

}
