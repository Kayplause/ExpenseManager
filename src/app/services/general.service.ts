import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginRes } from '../response-objects/login-res';

@Injectable()
export class GeneralService {
  navMenuBarDisplay: string; // navigation menu @ screen left-side setting
  contentViewDisplay: string; // content view setting (i.e screen display minus navMenu sidebar)
  showMenu: boolean; // toggles the menu-bar icon correspondingly
  parentMenu: string; // value for parent menu in navigation
  currentUrl: string; // holds the current url the User navigated to
  sessionExpired: boolean; // true if user session has expired
  isLoggedIn: boolean; // is user logged in?
  activeUser: any; // logged-in-user params
  uT: any[]; // user-organized-tabs

  constructor(private router: Router) {
    this.sessionExpired = window.sessionStorage.getItem('sE') ? true : false;
    this.isLoggedIn = window.sessionStorage.getItem('ls') ? true : false;
    this.activeUser = window.sessionStorage.getItem('ls')
      ? JSON.parse(window.sessionStorage.getItem('ls')) : new LoginRes();
  }

  organizeDBTabs() {
    const userTabs = [];

    // get user roles:
    const userRolesObjArr = this.activeUser.Roles;
    const userRoles = [];
    userRolesObjArr.map((v, k) => {
      userRoles.push(v.RoleName)
    });

    // get all tabs:
    const rdbTabs = JSON.parse(window.sessionStorage.getItem('ls'))['Tabs'];

    // filter tabs according to user-roles:
    this.tabFilter(rdbTabs, userRoles, userTabs);

    // sort descending by Id
    const dbTabs = userTabs.sort(function (a, b) {
      if (a.TabId < b.TabId) {
        return -1;
      }
      if (a.TabId > b.TabId) {
        return 1;
      }
      return 0;
    });

    // get parent tabs
    const parentTabs = dbTabs.filter(tab => tab.TabParentId === 0);

    // filter through the array and associate children tabs with their parents:
    dbTabs.map(dbtab => {
      dbtab.ChildrenTabs = {}; // define a new property in each tab called children
      dbtab.ChildrenTabs = dbTabs.filter(tab => tab.TabParentId === dbtab.TabId);
    });

    // filter to get only parent tabs with their children:
    const userOrganizedTabs = dbTabs.filter(tab => tab.TabParentId === 0);

    // store user tabs
    window.sessionStorage.setItem('uT', JSON.stringify(userOrganizedTabs));
  }

  tabFilter(arrayToFilter, userRoles, tabsArray) {
    arrayToFilter.map((val, key) => {
      const rolesArr = val.Roles.split(',');
      rolesArr.map((v, k) => {
        if (v === '*') {
          this.uniqueElements(tabsArray, val);
        }
        if (userRoles.indexOf(v) > -1 && v !== '*') {
          this.uniqueElements(tabsArray, val);
        }
      })
    });
  }

  uniqueElements(array, elem) {
    const isUnique = array.find((item) => {
      return elem === item;
    })
    let resp;
    isUnique === undefined ? resp = true : resp = false;
    if (resp) {
      array.push(elem);
    }
  }

  logout() {
    (this.sessionExpired === false) ?
      window.sessionStorage.clear() : window.sessionStorage.removeItem('ls');
    this.parentMenu = null; // reset the parent menu
    this.currentUrl = undefined; // reset current url
    this.activeUser = new LoginRes(); // unset user's details
    this.router.navigate(['/login']); // return the user to app's login page
    window.location.reload();
  }

}
