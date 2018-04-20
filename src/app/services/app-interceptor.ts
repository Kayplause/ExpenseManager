import { HeaderService } from './header.service';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private generalService: GeneralService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.generalService.isLoggedIn === true) {
      const cs = 'Bearer ' + this.generalService.activeUser.CustomSetting;
      const authReq = req.clone({ setHeaders: { Authorization: cs } });
      const requestUrl = authReq.url;
      return next.handle(authReq)
        .do(response => { // check if authentication is still valid otherwise log user out
          if (response instanceof HttpResponse) {
            const serverStatus =
              response.body.Status ? response.body.Status : response.body;
            if (serverStatus.IsSuccessful === false) {
              if (serverStatus.Message.TechnicalMessage === 'Authentication Error') {
                window.sessionStorage.setItem('sE', '1');
                this.generalService.logout();
              }
            } else {
              if (serverStatus.CustomSetting) {
                this.generalService.activeUser.CustomSetting = serverStatus.CustomSetting;
                this.generalService.activeUser.AuthToken = serverStatus.CustomToken;
                window.sessionStorage.setItem('ls', JSON.stringify(this.generalService.activeUser));
              }
            }
          }
        });
    }
    return next.handle(req);
  }
}
