import 'rxjs/add/operator/retry';
import { LoginReq } from './../request-objects/login-req';
import { LoginRes } from '../response-objects/login-res';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PasschangeReq } from '../request-objects/passchange-req';
import { PasschangeRes } from './../response-objects/passchange-res';
import { PassresetReq } from '../request-objects/passreset-req';
import { PassresetRes } from '../response-objects/passreset-res';

@Injectable()
export class LoginService {

  public isLoggedIn = false;

  constructor(private http: HttpClient, private apiOptions: HeaderService) { }

  login(data: LoginReq) {
    const endpoint = 'PlugPortal/Access/Login';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<LoginRes>(url, data, { headers: heading, observe: 'response' })
      .retry(3) // in case of failed request, retry 3 times
      .pipe();
  }

  changePassword(data: PasschangeReq) {
    const endpoint = 'PlugPortal/Access/ChangePasswordSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<PasschangeRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  resetPassword(data: PassresetReq) {
    const endpoint = 'PlugPortal/Access/ResetPasswordSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<PassresetRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  editProfile(data) {
    const endpoint = 'PlugPortal/Access/EditProfileSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return {message: 'Sorry, this option is unavailable at the moment'};
  }

}
