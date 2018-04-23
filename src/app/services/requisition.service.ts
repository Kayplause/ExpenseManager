import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';
import {
  LoadRequisition, AddRequisition, UpdateRequisition, DeleteRequisition,
  ApproveRequisition
} from '../request-objects/requisition';
import { LoadRequisitionResponse, RequisitionResponse } from '../response-objects/requisition-response';

@Injectable()
export class RequisitionService {

  constructor(private http: HttpClient,
    private headerOptions: HeaderService) { }

  loadRequisition(data: LoadRequisition) {
    const endPoint = 'ExpenseMgt/ExpenseTransactions/LoadExpenseRequisitions';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<LoadRequisitionResponse>(url, data, { headers: headers })
      .pipe(
        map(res => res),
        retry(3)
      );
  }

  addRequisition(data: AddRequisition) {
    const endPoint = 'ExpenseMgt/ExpenseTransactions/AddExpenseRequisition';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<RequisitionResponse>(url, data, { headers: headers })
      .pipe(
        map(res => res),
        retry(3)

      );
  }
  updateRequisition(data: UpdateRequisition) {
    const endPoint = 'ExpenseMgt/ExpenseTransactions/UpdateExpenseRequisition';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<RequisitionResponse>(url, data, { headers: headers })
      .pipe(
        map(res => res),
        retry(3)
      );
  }
  deleteRequisition(data: DeleteRequisition) {
    const endPoint = 'ExpenseMgt/ExpenseTransactions/DeleteExpenseRequisition';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;
    return this.http.post<RequisitionResponse>(url, data, { headers: headers })
      .pipe(
        map(res => res),
        retry(3)
      );
  }

  approveRequisition(data: ApproveRequisition) {
    const endPoint = 'ExpenseMgt/ExpenseSetting/ApprovedExpenseRequisition';
    const url = this.headerOptions.url + endPoint;
    const headers = this.headerOptions.headers;

    return this.http.post<RequisitionResponse>(url, data, { headers: headers })
      .pipe(
        map(res => res),
        retry(3)
      );
  }
}
