import { HttpClient } from '@angular/common/http';
import { HeaderService } from './header.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/retry';
import { AddtabReq } from '../request-objects/addtab-req';
import { AddtabRes } from '../response-objects/addtab-res';
import { LoadtabsRes } from './../response-objects/loadtabs-res';
import { LoadtabsReq } from './../request-objects/loadtabs-req';
import { LoadrolesRes } from './../response-objects/loadroles-res';
import { LoadrolesReq } from './../request-objects/loadroles-req';
import { AddportaluserRes } from '../response-objects/addportaluser-res';
import { AddroleReq } from './../request-objects/addrole-req';

@Injectable()
export class PortalmgtService {

  constructor(private http: HttpClient, private apiOptions: HeaderService) { }

  addTab(data: AddtabReq) {
    const endpoint = 'PlugPortal/Admin/AddTabSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddtabRes>(url, data, { headers: heading, observe: 'response' })
      .retry(0)
      .pipe();
  }

  getTabs(data: LoadtabsReq) {
    const endpoint = 'PlugPortal/Admin/LoadPortalTabs';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<LoadtabsRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  modifyTab(data) {
    const endpoint = 'PlugPortal/Admin/ModifyTabSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddtabRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  deleteTab(data) {
    const endpoint = 'PlugPortal/Admin/DeleteTabSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  getRoles(data: LoadrolesReq) {
    const endpoint = 'PlugPortal/Access/LoadAllPortalRoles';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<LoadrolesRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  addRole(data: AddroleReq) {
    const endpoint = 'PlugPortal/Access/AddRoleSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .retry(0)
      .pipe();
  }

  modifyRole(data) {
    const endpoint = 'PlugPortal/Access/ModifyRoleSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

  deleteRole(data) {
    const endpoint = 'PlugPortal/Access/DeleteRoleSys';
    const url = this.apiOptions.url + endpoint;
    const heading = this.apiOptions.headers;
    return this.http.post<AddportaluserRes>(url, data, { headers: heading, observe: 'response' })
      .pipe();
  }

}
