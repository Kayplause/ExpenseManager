import { BeneficiaryService } from './../../services/beneficiary.service';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from './../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, map, indexOf, toArray } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AddBeneficiary, LoadBeneficiary, DeleteBeneficiary, UpdateBeneficiary} from './../../request-objects/beneficiary';
import { BeneficiaryObj } from './../../response-objects/beneficiary-response';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})

export class BeneficiaryComponent implements OnInit {
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
  benefitTypes: any[] = [];
   beneficiaryObj: AddBeneficiary = new AddBeneficiary;
   loadbeneficiaryObj: LoadBeneficiary = new LoadBeneficiary;
   editbeneficiaryObj: UpdateBeneficiary = new UpdateBeneficiary;
   deletebeneficiaryObj: DeleteBeneficiary = new DeleteBeneficiary;
   beneficiaries: BeneficiaryObj[] = [];
   Token: string;
   message: string;
   successDisplay: boolean;
   showType: boolean;
   typeId: any = null;
  constructor( private generalService: GeneralService,
               private beneficiaryService: BeneficiaryService) { }

  ngOnInit() {
    this.loading = true;
    this.paginator.num = 10;
    this.loadBeneficiaries();
    // this.loadBeneficiaryType();
    this.successDisplay = true;
    this.showType = false;
  }

  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  BeneficiaryType(event ) {
   this.typeId = event.target.value;
   if (this.typeId) {
     this.showType = true;
     this.loadBeneficiaryType();
    //  this.beneficiaries = filter(this.beneficiaries, (item) => item.BeneficiaryTypeName == type)
   }  else {
     this.showType = false;
   }
  }

  loadBeneficiaryType() {
    this.loadbeneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadbeneficiaryObj.Status = -2;

    this.beneficiaryService.loadBeneficiaryType(this.loadbeneficiaryObj)
        .subscribe(data => {
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            // this.beneficiaries = data.Beneficiaries;
            this.beneficiaries = filter(data.Beneficiaries, (item) => item.BeneficiaryType == this.typeId);
            console.log(this.typeId);
          }
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        });
  }

  loadBeneficiaries() {
    this.loadbeneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loadbeneficiaryObj.Status = -2;

    this.beneficiaryService.loadBeneficiaries(this.loadbeneficiaryObj)
        .subscribe(data => {
          console.log(data);
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.beneficiaries = filter(data.Beneficiaries, (item) => {
              return item.StatusLabel === 'Active' || item.StatusLabel === 'InActive';
          });
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        }
  });
}

  triggerAdd() {
    this.beneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Beneficiary Added Successfully';

  }
  triggerEdit(id) {
    const beneficiary = filter(this.beneficiaries, (item) => item.BeneficiaryId === id)[0];
    this.editbeneficiaryObj.BeneficiaryId = id;
    this.editbeneficiaryObj.Fullname = beneficiary.Fullname;
    this.editbeneficiaryObj.MobileNumber = beneficiary.MobileNumber;
    this.editbeneficiaryObj.Email = beneficiary.Email;
    this.editbeneficiaryObj.Status = beneficiary.Status;
    this.editbeneficiaryObj.BeneficiaryType = beneficiary.BeneficiaryType;
    this.editbeneficiaryObj.Address = beneficiary.Address;
    this.editbeneficiaryObj.CompanyName = beneficiary.CompanyName;
    this.editbeneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Beneficiary was Updated Successfully';

  }
  triggerDelete(id, name) {
    this.successDisplay = true;
    this.deletebeneficiaryObj.BeneficiaryId = id;
    this.deletebeneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.editbeneficiaryObj.Fullname = name;
    this.message = 'Beneficiary was Deleted Successfully';
  }

  onAddBeneficiary ( form: NgForm) {
    this.beneficiaryObj.Status = ( form.value.Status == true) ? 1 : 0 ;
    this.beneficiaryObj.BeneficiaryType = this.typeId;
    this.stateA = 'out'; // hide the submit button while processing form
     this.stateB = 'in'; // display the status button

    this.beneficiaryService.addBeneficiary(this.beneficiaryObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.successHandler(this.message, form);

      //    this.beneficiaries = filter(data.Beneficiaries, (item) => item.BeneficiaryType == this.typeId);

          this.loadBeneficiaries();
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }

      });

  }
  onEditBeneficiary(form: NgForm) {
    this.editbeneficiaryObj.Status = (form.value.Status == true) ? 1 : 0;
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button

    this.beneficiaryService.updateBeneficiary(this.editbeneficiaryObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
          this.loadBeneficiaries();
          this.fadeOut();
          this.stateA = 'in';
          this.stateB = 'out';
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }
      });
  }

  onDeleteBeneficiary() {
    this.beneficiaryService.deleteBeneficiary(this.deletebeneficiaryObj)
    .subscribe(data => {
      if (data.Status.IsSuccessful) {
        this.responseAlert = true;
        this.requestPass = true;
        this.successDisplay = false;
        this.responseMessage = this.message;
        this.loadBeneficiaries();
        this.fadeOut();
      }
      if (!data.Status.IsSuccessful) {
        this.errorHandler(data);
      }
    });
  }


  private successHandler(message: string, form?: NgForm) {
    this.loading = false;
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
      this.loading = false;
      this.responseMessage = 'Unknown error occurred from the server. Please try again later';
      this.fadeOut();
    }
    if (data.Status.IsSuccessful ===  false) {
      this.stateA = 'in';  // Show the submit button while processing form
      this.stateB = 'out';
      this.responseAlert = true;
      this.requestPass = false;
      this.loading = false;
      this.responseMessage = data.Status.Message.FriendlyMessage;
      this.fadeOut();
    }
  }

  private formReset(form: NgForm) {
    form.reset();
    this.beneficiaryObj = new AddBeneficiary();
  }

  formHasUnsavedData() {
    if (this.beneficiaryObj === null) {
      if (
        this.beneficiaryObj.Fullname ||
        this.beneficiaryObj.MobileNumber ||
        this.beneficiaryObj.Email ||
        this.beneficiaryObj.Address ||
        this.beneficiaryObj.CompanyName
      ) {
         return true; }
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
