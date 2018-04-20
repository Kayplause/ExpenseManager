import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {

  public headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  public url = 'http://192.168.17.220/ExpenseManagerCloud/';



  constructor() { }

}
