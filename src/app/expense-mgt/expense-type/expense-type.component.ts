import { GeneralService } from './../../services/general.service';
import { AddExpenseType, LoadExpenseType, UpdateExpenseType, DeleteExpenseType } from './../../request-objects/expense-type';
import { ExpenseTypeObject } from './../../response-objects/expense-type-response';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PipeTransform, Pipe } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ExpenseTypeService } from '../../services/expense-type.service';
import { filter, map, indexOf, toArray } from 'lodash';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class ExpenseTypeComponent implements OnInit {

  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
  expenseTypeObj: AddExpenseType = new AddExpenseType;
   loadExpenseTypeObj: LoadExpenseType = new LoadExpenseType;
   editExpenseTypeObj: UpdateExpenseType = new UpdateExpenseType;
   deleteExpenseTypeObj: DeleteExpenseType = new DeleteExpenseType;
   expenseTypes: ExpenseTypeObject[] = [];
  Token: string;
  message: string;
  successDisplay: boolean;
  selectedItems: any[] = [];
  editSelectedItems: any[] = [];

  constructor( private generalService: GeneralService,
               private expenseService: ExpenseTypeService) { }

  ngOnInit() {
    this.loading = true;
    this.paginator.num = 10;
    this.loadExpenseTypes();
    this.successDisplay = true;
  }

  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  loadExpenseTypes() {
    this.loadExpenseTypeObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadExpenseTypeObj.Status = -2;

    this.expenseService.loadExpenseTypes(this.loadExpenseTypeObj)
        .subscribe(data => {
           console.log(data);
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.expenseTypes = filter(data.ExpenseTypes, (item) => {
              return item.StatusLabel === 'Active' || item.StatusLabel === 'InActive';
            });
          }
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        });
  }

  triggerAdd() {
    this.expenseTypeObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Expense Type Added Successfully';
  }

  onAddExpenseType(form: NgForm) {
    this.expenseTypeObj.Status = ( form.value.Status == true) ? 1 : 0 ;
    console.log(this.expenseTypeObj);

    this.stateA = 'out'; // hide the submit button while processing form
     this.stateB = 'in'; // display the status button
    this.expenseService.addExpenseType(this.expenseTypeObj)
      .subscribe(data => {
       console.log(data);
        if (data.Status.IsSuccessful) {
          this.successHandler(this.message, form);
          this.loadExpenseTypes();
        }
        if (!data.Status.IsSuccessful) {}
        this.errorHandler(data);
      });
    }

  triggerEdit(id) {
    if (id) {
      this.message = 'Expense Type was Updated Successfully';
      const expenseType = filter(this.expenseTypes, (item) => item.ExpenseTypeId == id)[0];
      this.editExpenseTypeObj.Name = expenseType.Name;
      this.editExpenseTypeObj.Code = expenseType.Code;
      this.editExpenseTypeObj.ExpenseTypeId = id;
      this.editExpenseTypeObj.Status = expenseType.Status;
      this.editExpenseTypeObj.SysPathCode = this.generalService.activeUser.AuthToken;
    }
  }

  triggerDelete(id, name) {
    this.successDisplay = true;
    this.editExpenseTypeObj.Name = name;
    this.deleteExpenseTypeObj.ExpenseTypeId = id;
    this.deleteExpenseTypeObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'ExpenseType was Successfully Deleted';
  }

  onEditExpenseType(form: NgForm) {
    this.editExpenseTypeObj.Status = (form.value.Status == true) ? 1 : 0;
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button

    this.expenseService.updateExpenseType(this.editExpenseTypeObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
          this.loadExpenseTypes();
          this.fadeOut();
          this.stateA = 'in';
          this.stateB = 'out';
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }
      });
 }

onDeleteExpenseType() {
  this.expenseService.deleteExpenseType(this.deleteExpenseTypeObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
          this.successDisplay = false;
          this.loadExpenseTypes();
          this.fadeOut();
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }
      });

}

private successHandler(message: string, form?: NgForm) {
  this.stateA = 'in'; // Display the submit button while processing form
  this.stateB = 'out'; // Hide the status button
  this.responseAlert = true;
  this.requestPass = true;
  this.responseMessage = message;
  this.formReset(form);
  this.fadeOut();

}

private errorHandler(data: any) {
  if (data.Status === null) {
    this.stateA = 'in';  // Display the submit button while processing form
    this.stateB = 'out'; // Hide the status button
    this.responseAlert = true;
    this.requestPass = false;
    this.responseMessage = 'Unknown error occurred from the server. Please try again later';
    this.fadeOut();
  }
  if (data.Status.IsSuccessful ===  false) {
    this.stateA = 'in';  // Show the submit button while processing form
    this.stateB = 'out';
    this.responseAlert = true;
    this.requestPass = false;
    this.responseMessage = data.Status.Message.FriendlyMessage;
    this.fadeOut();
  }
}

private formReset(form: NgForm) {
  form.reset();
  this.expenseTypeObj = new AddExpenseType();
}

formHasUnsavedData() {
  if (this.expenseTypeObj === null) {
    if (
      this.expenseTypeObj.Name
     ) { return true; }
  }
  return false;
}

canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
  if (this.formHasUnsavedData()) {
    // user has touched the form but not submitted or has submitted but update failed:
    return window.confirm('You have unsaved changes! Are you sure you want to leave this page?');
  }
  return true;
}


}
