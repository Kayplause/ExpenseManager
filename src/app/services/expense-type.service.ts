import { UpdateExpenseCategory } from './../request-objects/expense-category';
import { LoadExpenseTypeResponse, ExpenseTypeResponse } from './../response-objects/expense-type-response';
import { AddExpenseType, LoadExpenseType, UpdateExpenseType, DeleteExpenseType } from './../request-objects/expense-type';
import { Injectable } from '@angular/core';
import {map, retry} from 'rxjs/operators';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ExpenseTypeService {

  constructor(private http: HttpClient, private headerOptions: HeaderService) { }

  loadExpenseTypes(data: LoadExpenseType) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/LoadExpenseTypes';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<LoadExpenseTypeResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)
    );

  }

  addExpenseType(data: AddExpenseType) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/AddExpenseType';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseTypeResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)
    );

  }

  updateExpenseType(data: UpdateExpenseType) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/UpdateExpenseType';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseTypeResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)
    );

  }

  deleteExpenseType(data: DeleteExpenseType) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/DeleteExpenseType';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseTypeResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)
    );

  }
}
