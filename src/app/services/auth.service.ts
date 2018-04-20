import { HeaderService } from './header.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GeneralService } from './general.service';

@Injectable()
export class AuthService implements CanActivate {

  constructor(
    private router: Router,
    private generalService: GeneralService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    this.generalService.currentUrl = url;
    return this.pageLoad(url);
  }

  pageLoad(url: string): boolean {
    window.scrollTo(0, 0);
    this.unAuthorizedPage(url)
    if (window.innerWidth <= 767 && this.generalService.showMenu) {
      this.generalService.navMenuBarDisplay = 'invisible';
      this.generalService.showMenu = false;
      this.generalService.contentViewDisplay = 'clear';
    }
    // user is not logged in:
    if (this.generalService.isLoggedIn === false) {
      this.router.navigate(['/login']);
      return false;
    }
    // user is logged in:
    if (this.generalService.isLoggedIn === true) {
      return this.authCheck(url);
    }
  }

  authCheck(url) {
    if (this.generalService.activeUser.IsFirstTimeAccess === true) {
      if (this.firstTimeAccess(url)) {
        this.router.navigate(['/home']);
        return false;
      }
    }
    if (this.generalService.activeUser.IsFirstTimeAccess === false) {
      if (this.unAuthorizedPage(url)) {
        this.router.navigate(['/dashboard']);
        return false;
      }
    }
    return true;
  }

  firstTimeAccess(url) {
    const urls = ['/home', '/user/edit-profile', '/user/change-password'];
    const isValid = urls.find((element) => {
      return url === element;
    });
    let response;
    isValid === undefined ? response = true : response = false;
    return response;
  }

  unAuthorizedPage(url) {
    const userTabs = JSON.parse(window.sessionStorage.getItem('uT'));
    const urls = ['/user/edit-profile', '/user/change-password'];
    userTabs.map((v, k) => {
      if (v.ContentUrl !== "") {
        urls.push(`/${v.ContentUrl}`)
      };
      const childrenTabs = v.ChildrenTabs;
      childrenTabs.map((val, key) => {
        urls.push(`/${val.ContentUrl}`)
      })
    })
    const isValid = urls.find((element) => {
      return url === element;
    });
    let response;
    isValid === undefined ? response = true : response = false;
    return response;
  }

}
