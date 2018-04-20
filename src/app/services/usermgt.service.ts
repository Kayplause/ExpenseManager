import { AddusertoroleReq } from './../request-objects/addusertorole-req';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from './header.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/retry';
import { AddportaluserReq } from '../request-objects/addportaluser-req';
import { AddportaluserRes } from './../response-objects/addportaluser-res';
import { LoadportalusersRes } from './../response-objects/loadportalusers-res';
import { LoadportalusersReq } from './../request-objects/loadportalusers-req';

@Injectable()
export class UsermgtService {

  constructor(private http: HttpClient, private apiOptions: HeaderService) { }

  addUser(data: AddportaluserReq) {
    const endpoint = 'PlugPortal/Access/AddPortalUser';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .retry(0)
      .pipe();
  }

  getUsers(data: LoadportalusersReq) {
    const endpoint = 'PlugPortal/Access/LoadAllPortalUsers';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<LoadportalusersRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  modifyUser(data) {
    const endpoint = 'PlugPortal/Access/ModifyPortalUser';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  addUserToRole(data: AddusertoroleReq) {
    const endpoint = 'PlugPortal/Access/AdUserToRoleSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .retry(0)
      .pipe();
  }

  removeUserRole(data: AddusertoroleReq) {
    const endpoint = 'PlugPortal/Access/RemoveUserRoleSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .retry(0)
      .pipe();
  }

}
