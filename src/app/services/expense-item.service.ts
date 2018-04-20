import { Injectable } from '@angular/core';
import {map, retry} from 'rxjs/operators';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';
import { LoadExpenseItems, AddExpenseItem, UpdateExpenseItems, DeleteExpenseItems,
   ApprovedExpenseItem } from '../request-objects/expense-item';
import { LoadExpenseItemResponse, ExpenseItemResponse } from '../response-objects/expense-item-response';

@Injectable()
export class ExpenseItemService {

  constructor(private http: HttpClient, private headerOptions: HeaderService) { }

  loadExpenseItem(data: LoadExpenseItems) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/LoadExpenseItems';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<LoadExpenseItemResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)
    );
  }

  addExpenseItem(data: AddExpenseItem) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/AddExpenseItem';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseItemResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)

    );
  }
  updateExpenseItem(data: UpdateExpenseItems) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/UpdateExpenseItem';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseItemResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)

    );
  }
  deleteExpenseItem(data: DeleteExpenseItems) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/DeleteExpenseItem';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseItemResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)

    );
  }

  approvedExpenseItem(data: ApprovedExpenseItem) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/ApprovedExpenseItem';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<ExpenseItemResponse>(url, data, {headers: headers})
    .pipe(
      map(res => res),
      retry(3)

    );
  }
}
