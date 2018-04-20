import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { BeneficiaryResponse, LoadBeneficiaryResponse } from './../response-objects/beneficiary-response';
// tslint:disable-next-line:max-line-length
import {  AddBeneficiary, LoadBeneficiary, UpdateBeneficiary, DeleteBeneficiary } from './../request-objects/beneficiary';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class BeneficiaryService {

  constructor(private router: Router, private http: HttpClient,
              private headerOptions: HeaderService) { }


    loadBeneficiaryType(data: LoadBeneficiary) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/LoadBeneficiaries';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<LoadBeneficiaryResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }


    addBeneficiary(data: AddBeneficiary) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/AddBeneficiary';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<BeneficiaryResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }

    loadBeneficiaries (data: LoadBeneficiary) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/LoadBeneficiaries';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<LoadBeneficiaryResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }

    updateBeneficiary(data:  UpdateBeneficiary) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/UpdateBeneficiary';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;

      return this.http.post<BeneficiaryResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }

      deleteBeneficiary(data: DeleteBeneficiary ) {
      const endPoint = 'ExpenseMgt/ExpenseSetting/DeleteBeneficiary';
      const url = this.headerOptions.url + endPoint;
      const headers = this.headerOptions.headers;
      return this.http.post<BeneficiaryResponse>(url, data, {headers: headers}).pipe(
        map(res => res)
      );
    }
}
