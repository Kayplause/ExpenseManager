import { ExpenseTypeObject } from './../../response-objects/expense-type-response';
import { AccountHeadItemObj } from './../../response-objects/account-head-response';
import { ExpCategoryObj } from './../../response-objects/exp-category-response';
import { ExpenseTypeService } from './../../services/expense-type.service';
import { LoadExpenseType } from './../../request-objects/expense-type';
import { LoadAccountHead } from './../../request-objects/add-account-head';
import { ExpenseCategoryService } from './../../services/expense-category.service';
import { ExpenseItemService } from './../../services/expense-item.service';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from './../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, map, indexOf, toArray } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AddExpenseItem, LoadExpenseItems, DeleteExpenseItems, UpdateExpenseItems,
         ApprovedExpenseItem } from './../../request-objects/expense-item';
import { ExpenseItemObj } from './../../response-objects/expense-item-response';
import { NgForm } from '@angular/forms';
import { AccountHeadService } from '../../services/account-head.service';
import { LoadExpenseCategory } from '../../request-objects/expense-category';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})


export class ExpenseItemComponent implements OnInit {
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count

   expenseItemObj: AddExpenseItem = new AddExpenseItem;
   loadExpenseItemObj: LoadExpenseItems = new LoadExpenseItems;
   editExpenseItemObj: UpdateExpenseItems = new UpdateExpenseItems;
   deleteExpenseItemObj: DeleteExpenseItems = new DeleteExpenseItems;
   approvedExpenseItemObj: ApprovedExpenseItem = new ApprovedExpenseItem;
   filteredExpenseItems: ExpenseItemObj[] = [];
   expenseitems: any[] = [];
   loadacctHeadObj: LoadAccountHead = new LoadAccountHead;
   loadexpCatObj: LoadExpenseCategory = new LoadExpenseCategory;
   loadExpenseTypeObj: LoadExpenseType = new LoadExpenseType;
   accounts: AccountHeadItemObj[] = [];
   filteredAccountHeads:  AccountHeadItemObj[] = [];
   expensecategories: ExpCategoryObj[] = [];
   expenses: ExpenseTypeObject[]= [];
   Role: null;
   Token: string;
   message: string;
   successDisplay: boolean;
   expTypeId;
   expenseCatId;
   btnShow: boolean;
   expItemId;
  constructor( private generalService: GeneralService,
               private itemService: ExpenseItemService,
               public accountService: AccountHeadService,
               public expenseCategoryService: ExpenseCategoryService,
               public expensetypeService: ExpenseTypeService  ) { }

  ngOnInit() {
    this.loading = true;
    this.paginator.num = 10;
    // this.loadExpenseTypes();
    this.LoadExpCategory();
    this.loadAccountHead();
    this.successDisplay = true;
    this.loadExpenseItem();
    this.Role = this.generalService.activeUser.Roles[0].RoleName;
  }
  showAction() {
    this.Role = this.generalService.activeUser.Roles[0].RoleName;
    if (this.Role == '*') {
      return true;
    }
    return false;
  }

  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  loadAccountHead() {
    this.loadacctHeadObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadacctHeadObj.Status = 1;

    this.accountService.loadAccountHead(this.loadacctHeadObj)
        .subscribe(data => {
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.accounts = data.AccountHeads;
          }
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        });
  }

  loadExpenseTypes() {
    this.loadExpenseTypeObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadExpenseTypeObj.Status = 1;

    this.expensetypeService.loadExpenseTypes(this.loadExpenseTypeObj)
        .subscribe(data => {
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.expenses = data.ExpenseTypes;
          }
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        });
  }

  LoadExpCategory() {
    this.loadexpCatObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadexpCatObj.Status = 1;

    this.expenseCategoryService.LoadExpCategory(this.loadexpCatObj)
        .subscribe(data => {
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.expensecategories = data.ExpenseCategories;
          }
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        });
  }

  loadExpenseItem() {
    this.loadExpenseItemObj.Status = -2;
    this.loadExpenseItemObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loading = false;
    this.itemService.loadExpenseItem(this.loadExpenseItemObj)
    .subscribe(data => {
      if (data.Status.IsSuccessful ) {
        this.expenseitems = filter(data.ExpenseItems, (item) => {
          return (item.StatusLabel == 'Active') || (item.StatusLabel == 'InActive');
        });
      }
      if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
      }
    });
  }

  triggerAdd() {
    this.expenseItemObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Expense Item Added Successfully';
  }

  onAddExpenseItem(form: NgForm) {

    this.expenseItemObj.Status = ( form.value.Status === true) ? 0 : 0 ;
    this.expenseItemObj.ExpenseCategoryId = this.expenseCatId;
    this.expenseItemObj.ExpenseTypeId = this.expTypeId;
    this.expenseItemObj.AccountHeadId = form.value.Account;
    console.log(this.expenseItemObj);


    this.stateA = 'in'; // hide the submit button while processing form
     this.stateB = 'out'; // display the status button

     if (form.valid) {
      this.itemService.addExpenseItem(this.expenseItemObj)
      .subscribe(data => {

        if (data.Status.IsSuccessful) {
          this.successHandler(this.message, form);
          this.loadExpenseItem();
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }

      });
     }
  }

  ExpenseCategory(expenseCategoryId) {
    this.expenseCatId = expenseCategoryId;
     if (this.expenseCatId > 0 && !this.expTypeId) {
      this.btnShow = true;
      this.filteredExpenseItems = filter(this.expenseitems, (item) => item.ExpenseCategoryId == this.expenseCatId);
      this.loadExpenseTypes();
    }
    if (this.expenseCatId && this.expTypeId) {
      this.btnShow = true;
      this.filteredExpenseItems = filter(this.expenseitems, (item) => item.ExpenseCategoryId == this.expenseCatId);
    }
    if (!this.expenseCatId) {
        this.expenseCatId = '';
        this.expTypeId = '';
        this.btnShow = false;
        this.filteredExpenseItems = [];
    }
  }

  changeExpenseType(expenseTypeId) {
    this.expTypeId = expenseTypeId;
    if ( this.expTypeId > 0 && this.expenseCatId > 0 ) {
      this.filteredExpenseItems = filter(this.expenseitems, (item) => {
        return (item.ExpenseCategoryId == this.expenseCatId) && (item.ExpenseTypeId == this.expTypeId);
      });
   }

  if (!this.expTypeId) {
    this.expTypeId = '';
  }
}

  triggerEdit(ExpenseItemId) {
    if (ExpenseItemId) {
      const expenseitem = filter(this.expenseitems, (item) => item.ExpenseItemId == ExpenseItemId)[0];
      this.editExpenseItemObj.ExpenseItemId = ExpenseItemId;
      this.editExpenseItemObj.AccountHeadId = expenseitem.AccountHeadId;
      console.log(expenseitem);
      this.editExpenseItemObj.ExpenseCategoryId = this.expenseCatId;
      this.editExpenseItemObj.ExpenseTypeId = this.expTypeId;
      this.editExpenseItemObj.Status = expenseitem.Status;
      this.editExpenseItemObj.SysPathCode = this.generalService.activeUser.AuthToken;
      this.editExpenseItemObj.Code = expenseitem.Code;
      this.editExpenseItemObj.Name = expenseitem.Name;
      this.editExpenseItemObj.Description = expenseitem.Description;
      this.editExpenseItemObj.UnitPrice = expenseitem.UnitPrice;
      this.message = 'Expense Item Updated Successfully';
    }
  }

  triggerDelete(id, name) {
    this.successDisplay = true;
    this.deleteExpenseItemObj.ExpenseItemId = id;
    this.deleteExpenseItemObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Expense Item was Deleted Successfully';
  }


  

  onEditExpenseItem(form: NgForm) {

    this.editExpenseItemObj.Status = (form.value.Status === true) ? 0 : 0;
      this.itemService.updateExpenseItem(this.editExpenseItemObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
          this.loadExpenseItem();
          this.fadeOut();
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }
      });

  }

  onDeleteExpenseItem() {
    this.itemService.deleteExpenseItem(this.deleteExpenseItemObj)
    .subscribe(data => {
      if (data.Status.IsSuccessful) {
        this.responseAlert = true;
        this.requestPass = true;
        this.successDisplay = false;
        this.responseMessage = this.message;
        this.loadExpenseItem();
        this.fadeOut();
      }
      if (!data.Status.IsSuccessful) {
        this.errorHandler(data);
      }
    });
  }

  triggerApprove(ExpenseItemId) {
    if (ExpenseItemId) {
      const expenseitem = filter(this.expenseitems, (item) => item.ExpenseItemId == ExpenseItemId)[0];
      this.approvedExpenseItemObj.ExpenseItemId = ExpenseItemId;
      this.approvedExpenseItemObj.SysPathCode  = this.generalService.activeUser.AuthToken;
      this.approvedExpenseItemObj.ApprovedUnitPrice = expenseitem.ApprovedUnitPrice;
      this.approvedExpenseItemObj.Status =  expenseitem.Status;
      this.editExpenseItemObj.Name = expenseitem.Name;
      this.editExpenseItemObj.ExpenseItemId = ExpenseItemId;
      this.message = 'Expense Item has now been Approved';
    }
  }

  onApproveExpenseItem(form: NgForm) {
    this.approvedExpenseItemObj.Status = (form.value.Status === true) ? 1 : 0;
      this.itemService.approvedExpenseItem(this.approvedExpenseItemObj)
      .subscribe(data => {

        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
      //    this.loadExpenseItem();
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
    this.expenseItemObj = new AddExpenseItem();
  }

  formHasUnsavedData() {
    if (this.expenseItemObj === null) {
      if (
        this.expenseItemObj.Name ||
        this.expenseItemObj.Code ||
        this.expenseItemObj.Description ||
        this.expenseItemObj.UnitPrice ||
        this.expenseItemObj.Status ||
        this.expenseItemObj.ExpenseTypeId ||
        this.expenseItemObj.AccountHeadId
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
