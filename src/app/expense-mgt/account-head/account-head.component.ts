import { GeneralService } from './../../services/general.service';
import { AccountHeadService } from './../../services/account-head.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PipeTransform, Pipe } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AddAccountHead, LoadAccountHead, DeleteAccountHead, UpdateAccountHead} from './../../request-objects/add-account-head';
import { AccountHeadItemObj } from './../../response-objects/account-head-response';
import { filter, map, indexOf, toArray } from 'lodash';

@Component({
  selector: 'app-account-head',
  templateUrl: './account-head.component.html',
  styleUrls: ['./account-head.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class AccountHeadComponent implements OnInit {

  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
   addAcctHeadObj: AddAccountHead = new AddAccountHead;
   loadAcctHeadObj: LoadAccountHead = new LoadAccountHead;
   editAcctHeadObj: UpdateAccountHead = new UpdateAccountHead;
   deleteAcctHeadObj: DeleteAccountHead = new DeleteAccountHead;
   accounts: AccountHeadItemObj[] = [];
  Token: string;
  message: string;
  successDisplay: boolean;
  selectedItems: any[] = [];
  editSelectedItems: any[] = [];





  constructor( private accountHeadService: AccountHeadService,
               public generalService: GeneralService) {
    // this.generalService.activeUser.AuthToken = this.generalService.activeUser.AuthToken;
   }

  ngOnInit() {
    this.loading = true;
    this.paginator.num = 10;
    this.successDisplay = true;
    this.loadAccountHead();
  }

  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }



 loadAccountHead() {
  this.loadAcctHeadObj.SysPathCode = this.generalService.activeUser.AuthToken;
  this.loadAcctHeadObj.Status = -2;

  this.accountHeadService.loadAccountHead(this.loadAcctHeadObj)
      .subscribe(data => {
        this.accounts = data.AccountHeads;
        console.log(data);

        if (data.Status.IsSuccessful ) {
          this.loading = false;
          this.accounts = filter(data.AccountHeads, (item) => {
            return item.StatusLabel === 'Active' || item.StatusLabel === 'InActive';
          });
        }
        if (!data.Status.IsSuccessful) {
            this.errorHandler(data);
        }
      });

}

triggerAdd() {
  this.addAcctHeadObj.SysPathCode = this.generalService.activeUser.AuthToken;
  this.message = 'Account Head Added Successfully';
}
triggerEdit(id) {
  if (id) {
    this.message = 'Expense Category was Updated Successfully';
    const account = filter(this.accounts, (item) => item.AccountHeadId == id)[0];
    this.editAcctHeadObj.Title = account.Title;
    this.editAcctHeadObj.Code = account.Code;
    this.editAcctHeadObj.Description = account.Description;
    this.editAcctHeadObj.AccountHeadId = id;
    this.editAcctHeadObj.Status = account.Status;
    this.editAcctHeadObj.SysPathCode = this.generalService.activeUser.AuthToken;
  }
}

triggerDelete(id, name) {
  this.successDisplay = true;
  this.editAcctHeadObj.Title = name;
  this.deleteAcctHeadObj.AccountHeadId = id;
  this.deleteAcctHeadObj.SysPathCode = this.generalService.activeUser.AuthToken;
  this.message = 'AccountHead was Successfully Deleted';
}


onAddAccountHead(form: NgForm) {
  this.addAcctHeadObj.Status = ( form.value.Status == true) ? 1 : 0 ;
//  console.log(this.addExpCatObj);
  this.stateA = 'out'; // hide the submit button while processing form
   this.stateB = 'in'; // display the status button
  this.accountHeadService.addAccountHead(this.addAcctHeadObj)
    .subscribe(data => {
      console.log(data);
      if (data.Status.IsSuccessful) {
        this.successHandler(this.message, form);
        this.loadAccountHead();
      }
      if (!data.Status.IsSuccessful) {}
      this.errorHandler(data);
    });

}
onEditAccount(form: NgForm) {
   this.editAcctHeadObj.Status = (form.value.Status == true) ? 1 : 0;
   this.stateA = 'out'; // hide the submit button while processing form
   this.stateB = 'in'; // display the status button

   this.accountHeadService.updateAccountHead(this.editAcctHeadObj)
     .subscribe(data => {
       if (data.Status.IsSuccessful) {
         this.responseAlert = true;
         this.requestPass = true;
         this.responseMessage = this.message;
         this.loadAccountHead();
         this.fadeOut();
         this.stateA = 'in';
         this.stateB = 'out';
       }
       if (!data.Status.IsSuccessful) {
         this.errorHandler(data);
       }
     });
}

onDeleteAccountHead() {
  this.accountHeadService.deleteAccountHead(this.deleteAcctHeadObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
          this.successDisplay = false;
          this.loadAccountHead();
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
  this.addAcctHeadObj = new AddAccountHead();
}

formHasUnsavedData() {
  if (this.addAcctHeadObj === null) {
    if (
      this.addAcctHeadObj.Title
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






