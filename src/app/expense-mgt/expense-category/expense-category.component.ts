
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GeneralService } from './../../services/general.service';
import { ExpenseCategoryService } from './../../services/expense-category.service';
// tslint:disable-next-line:max-line-length
import {AddExpenseCategory, LoadExpenseCategory, UpdateExpenseCategory, DeleteExpenseCategory } from './../../request-objects/expense-category';

import { NgForm} from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { map, filter } from 'lodash';
import { ExpCategoryObj } from '../../response-objects/exp-category-response';


@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class ExpenseCategoryComponent implements OnInit {

  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
  addExpCatObj: AddExpenseCategory = new AddExpenseCategory;
  loadExpCatObj: LoadExpenseCategory = new LoadExpenseCategory;
  editExpCatObj: UpdateExpenseCategory = new UpdateExpenseCategory;
  deleteExpCatObj: DeleteExpenseCategory = new DeleteExpenseCategory;
  expenseCategories: ExpCategoryObj[] = [];
  Token: string;
  message: string;
  successDisplay: boolean;
  selectedItems: any[] = [];
  editSelectedItems: any[] = [];
  providerCodes: any[] = [];

  constructor(private generalService: GeneralService,
    private expCatService: ExpenseCategoryService) {
    }

  ngOnInit() {
    this.loading = true;
    this.paginator.num = 10;
    this.successDisplay = true;
    this.LoadExpCategory();
  }

  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }


  LoadExpCategory() {
    this.loadExpCatObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadExpCatObj.Status = -2;

    this.expCatService.LoadExpCategory(this.loadExpCatObj)
        .subscribe(data => {
          console.log(data);
          this.expenseCategories = data.ExpenseCategories;
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.expenseCategories = filter(data.ExpenseCategories, (item) => {
              return item.StatusLabel == 'Active' || item.StatusLabel == 'InActive';
            });
          }
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        });
  }

  triggerAdd() {
    this.addExpCatObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Expense Added Successfully';
  }

  triggerEdit(id) {
     if (id) {
       this.message = 'Expense Category was Updated Successfully';
       const expenseCategory = filter(this.expenseCategories, (item) => item.ExpenseCategoryId == id)[0];
       this.editExpCatObj.Name = expenseCategory.ExpenseCategoryName;
       this.editExpCatObj.Code = expenseCategory.Code;
       this.editExpCatObj.ExpenseCategoryId = id;
       this.editExpCatObj.Status = expenseCategory.Status;
       this.editExpCatObj.SysPathCode = this.generalService.activeUser.AuthToken;
    //   console.log(this.editExpCatObj);
     }

  }


  onAddExpenseCategory(form: NgForm) {
    this.addExpCatObj.Status = ( form.value.Status == true) ? 1 : 0 ;
   // console.log(this.addExpCatObj)

    this.stateA = 'out'; // hide the submit button while processing form
     this.stateB = 'in'; // display the status button
    this.expCatService.AddExpCategory(this.addExpCatObj)
      .subscribe(data => {
    //    console.log(data);
        if (data.Status.IsSuccessful) {
          this.successHandler(this.message, form);
          this.LoadExpCategory();
        }
        if (!data.Status.IsSuccessful) {}
        this.errorHandler(data);
      });
  }

  onEditExpenseCategory(form: NgForm) {
     this.editExpCatObj.Status = (form.value.Status == true) ? 1 : 0;
     this.stateA = 'out'; // hide the submit button while processing form
     this.stateB = 'in'; // display the status button

     this.expCatService.UpdExpCategory(this.editExpCatObj)
       .subscribe(data => {
 //        console.log(data);
         if (data.Status.IsSuccessful) {
           this.responseAlert = true;
           this.requestPass = true;
           this.responseMessage = this.message;
           this.LoadExpCategory();
           this.fadeOut();
           this.stateA = 'in';
           this.stateB = 'out';
         }
         if (!data.Status.IsSuccessful) {
           this.errorHandler(data);
         }
       });
  }


  triggerDelete(id, name) {
    this.successDisplay = true;
    this.editExpCatObj.Name = name;
    this.deleteExpCatObj.ExpenseCategoryId = id;
    this.deleteExpCatObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Expense Category was Deleted Successfully';
  }


  onDeleteExpenseCategory() {
    this.expCatService.DelExpenseCategory(this.deleteExpCatObj)
    .subscribe(data => {
      if (data.Status.IsSuccessful) {
        this.responseAlert = true;
        this.requestPass = true;
        this.responseMessage = this.message;
        this.successDisplay = false;
        this.LoadExpCategory();
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
    this.addExpCatObj = new AddExpenseCategory();
  }

  formHasUnsavedData() {
    if (this.addExpCatObj === null) {
      if (
        this.addExpCatObj.Name ||
        this.addExpCatObj.Code
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

