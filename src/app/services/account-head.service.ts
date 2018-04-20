import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { AccountHeadResponse, LoadAccountHeadResponse } from './../response-objects/account-head-response';
// tslint:disable-next-line:max-line-length
import {  AddAccountHead, LoadAccountHead, UpdateAccountHead, DeleteAccountHead } from './../request-objects/add-account-head';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountHeadService {

  constructor( private router: Router, private http: HttpClient,
    private headerOptions: HeaderService) { }


    addAccountHead(data: AddAccountHead) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/AddAccountHead';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<AccountHeadResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
     );
    }

    loadAccountHead (data: LoadAccountHead) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/LoadAccountHeads';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<LoadAccountHeadResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }

    updateAccountHead(data: LoadAccountHead) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/UpdateAccountHead';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<AccountHeadResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }

     deleteAccountHead(data: LoadAccountHead) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/DeleteAccountHead';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<AccountHeadResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }
}
