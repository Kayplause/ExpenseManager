import { HeaderService } from './header.service';
import { ExpCategoryResponse, LoadExpCategoryResponse } from './../response-objects/exp-category-response';
// tslint:disable-next-line:max-line-length
import {  AddExpenseCategory, LoadExpenseCategory, UpdateExpenseCategory, DeleteExpenseCategory } from './../request-objects/expense-category';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/Promise';

@Injectable()
export class ExpenseCategoryService {

// selectedExpCategory: ExpCategory;
// ExpenseCategory: ExpCategory[];

  constructor( private router: Router, private http: HttpClient,
               private headerOptions: HeaderService) { }

  AddExpCategory(data: AddExpenseCategory) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/AddExpenseCategory';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpCategoryResponse>(url, data, {headers: headers}).pipe(
      map(res => res)
   );
  }

  LoadExpCategory(data: LoadExpenseCategory) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/LoadExpenseCategories';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<LoadExpCategoryResponse>(url, data, {headers: headers}).pipe(
      map(res => res)
    );
  }
  // LoadExpCategory(data: LoadExpenseCategory): any {
  //      const body = JSON.stringify(data);
  //   //  const endPoint = 'ExpenseMgt/ExpenseSetting/LoadExpenseCategories';
  //   //  const url = this.headerOptions + 'endPoint';
  //     const headers = this.headerOptions.headers;
  //   return this.http.post<LoadExpCategoryResponse>
  //   ('http://192.168.17.220/ExpenseManagerCloud/Help/Api/POST-ExpenseMgt-ExpenseSetting-LoadExpenseCategories',
  //    body, {headers: headers}).
  //    map(res => res);
  // }

   UpdExpCategory(data: UpdateExpenseCategory) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/UpdateExpenseCategory';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpCategoryResponse>(url, data, {headers: headers}).pipe(
    map(res => res),
    retry(3)
  );
 }

   DelExpenseCategory(data: DeleteExpenseCategory) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/DeleteExpenseCategory';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpCategoryResponse>(url, data, {headers: headers}).pipe(
    map(res => res)
   );
   }

  }

