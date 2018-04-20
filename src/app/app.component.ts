import { HeaderService } from './services/header.service';
import { Router, ActivatedRoute } from '@angular/router';
import { state, trigger, animate, style, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from './services/general.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { LoginRes } from './response-objects/login-res';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // menuBar animation
    trigger('menuBarDP', [
      state(
        'visible', style({
          transform: 'translateX(0)',
          display: 'block',
          opacity: 1
        })
      ),
      state(
        'invisible', style({
          transform: 'translateX(-100%)',
          display: 'none',
          opacity: 0
        })
      ),
      transition('invisible => visible', animate('200ms ease-in')),
      transition('visible => invisible', animate('200ms ease-out'))
    ]),
    // content view animation
    trigger('contentDP', [
      state('clear', style({ background: 'inherit' })),
      state('opaque', style({ background: 'rgba(0, 0, 0, 0.5)' })),
    ])
  ]
})

export class AppComponent implements OnInit {
  idleState = 'Not started';
  timedOut = false;
  lastPing?: Date = null;

  constructor(
    public generalService: GeneralService,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // sets an idle timeout of 5 mins.
    idle.setIdle(300);
    // sets a timeout period of 1 seconds. after 301 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(1);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      const url = this.router.url;
      (url !== '/login') ? window.sessionStorage.setItem('sE', '1') : '';
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  ngOnInit() {
    this.generalService.showMenu = true; // show the sidebar-left by default
    this.generalService.navMenuBarDisplay = 'visible'; // side-menu bar is set to visible
    this.generalService.contentViewDisplay = 'opaque'; // sets opacity to content area view (<=767px)
    this.smallScreenDp(); // setting for screen <=767px
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started';
    this.timedOut = false;
  }

  logout() {
    const url = this.router.url;
    this.reset();
    if (url !== '/login') {
      window.sessionStorage.removeItem('ls');
      this.generalService.parentMenu = null; // reset the parent menu
      this.generalService.currentUrl = undefined; // reset current url
      this.generalService.activeUser = new LoginRes(); // unset user's details
      this.router.navigate(['/login']); // return the user to app's login page
      window.location.reload();
    }
  }

  smallScreenDp() {
    // in small screen, hide the sidebar menu and remove opacity when content area is clicked
    if (window.innerWidth <= 767 && this.generalService.showMenu) {
      this.generalService.navMenuBarDisplay = 'invisible';
      this.generalService.contentViewDisplay = 'clear';
      this.generalService.showMenu = false;
    }
  }

  dismissTimeoutAlert() {
    window.sessionStorage.removeItem('sE');
    this.generalService.sessionExpired = false;
  }

}
