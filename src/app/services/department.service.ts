import { LoadDepartmentResponse, DepartmentResponse } from './../response-objects/department-response';
import { LoadDepartment, AddDepartment, UpdateDepartment, DeleteDepartment } from './../request-objects/department';
import { Injectable } from '@angular/core';
import {map, retry} from 'rxjs/operators';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Injectable()
export class DepartmentService {

  constructor( private http: HttpClient,
               private headerOptions: HeaderService,
               private router: Router ) { }



loadDepartment (data: LoadDepartment) {
  const endPoint = 'ExpenseMgt/ExpenseSetting/LoadDepartments';
  const url = this.headerOptions.url + endPoint;
  const headers = this.headerOptions.headers;

  return this.http.post<LoadDepartmentResponse>(url, data, {headers: headers})
  .pipe(
    map(res => res),
    retry(3)
  );
}

addDepartment(data: AddDepartment) {
  const endPoint = 'ExpenseMgt/ExpenseSetting/AddDepartment';
  const url = this.headerOptions.url + endPoint;
  const headers = this.headerOptions.headers;

  return this.http.post<DepartmentResponse>(url, data, {headers: headers})
  .pipe(
    map(res => res),
    retry(3)
  );

}

updateDepartment(data: UpdateDepartment) {
  const endPoint = 'ExpenseMgt/ExpenseSetting/UpdateDepartment';
  const url = this.headerOptions.url + endPoint;
  const headers = this.headerOptions.headers;

  return this.http.post<DepartmentResponse>(url, data, {headers: headers})
  .pipe(
    map(res => res),
    retry(3)
  );

}

deleteDepartment(data: DeleteDepartment) {
  const endPoint = 'ExpenseMgt/ExpenseSetting/DeleteDepartment';
  const url = this.headerOptions.url + endPoint;
  const headers = this.headerOptions.headers;

  return this.http.post<DepartmentResponse>(url, data, {headers: headers})
  .pipe(
    map(res => res),
    retry(3)
  );
}

}
