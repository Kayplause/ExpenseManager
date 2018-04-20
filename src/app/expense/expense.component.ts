import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, map, indexOf, toArray } from 'lodash';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})

export class ExpenseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
