import { RequisitionService } from './../../services/requisition.service';
import { ExpenseRequisitionObj, LoadRequisitionResponse } from './../../response-objects/requisition-response';
import { BeneficiaryObj } from './../../response-objects/beneficiary-response';
import { LoadExpenseItems } from './../../request-objects/expense-item';
import { DepartmentObj } from './../../response-objects/department-response';
import { LoadDepartment } from './../../request-objects/department';
import { LoadBeneficiary, AddBeneficiary } from './../../request-objects/beneficiary';
import { DepartmentService } from './../../services/department.service';
import { DepartmentComponent } from './../department/department.component';
import { BeneficiaryService } from './../../services/beneficiary.service';
import { BeneficiaryComponent } from './../beneficiary/beneficiary.component';
import { Component, OnInit } from '@angular/core';
import { ExpenseTypeObject } from './../../response-objects/expense-type-response';
import { AccountHeadItemObj } from './../../response-objects/account-head-response';
import { ExpCategoryObj } from './../../response-objects/exp-category-response';
import { ExpenseTypeService } from './../../services/expense-type.service';
import { LoadExpenseType } from './../../request-objects/expense-type';
import { LoadAccountHead } from './../../request-objects/add-account-head';
import { ExpenseItemService } from './../../services/expense-item.service';
import { GeneralService } from './../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, map, indexOf, toArray } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { LoadRequisition, DeleteRequisition, UpdateRequisition,
        ApproveRequisition,  AddRequisition, RequisitiontItem, Helpers} from './../../request-objects/requisition';
import { ExpenseItemObj } from './../../response-objects/expense-item-response';
import { NgForm } from '@angular/forms';
import { AccountHeadService } from '../../services/account-head.service';
import { LoadExpenseCategory } from '../../request-objects/expense-category';



@Component({
  selector: 'app-requistion-item',
  templateUrl: './requistion-item.component.html',
  styleUrls: ['./requistion-item.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})
export class RequistionItemComponent implements OnInit {
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
  requisitionListObj: RequisitiontItem = new RequisitiontItem;
  // requisitions: AddRequisitionList[] = [];
   requisitionObj: AddRequisition = new AddRequisition;
   requisitionItemBObj: AddRequisition[] = [];
   loadrequisitionObj: LoadRequisition = new LoadRequisition;
   editExpenseItemObj: UpdateRequisition = new UpdateRequisition;
   deleteRequisitionObj: DeleteRequisition = new DeleteRequisition;
   approveRequisitionObj: ApproveRequisition = new ApproveRequisition;
   requisitionsObj: ExpenseRequisitionObj[] = [];
  // ExpenseRequisitionObj:
  loadExpenseItemObj: LoadExpenseItems = new LoadExpenseItems;
  filteredExpenseItems: ExpenseItemObj[] = [];
  expenseitems: any[] = [];
   loadacctHeadObj: LoadAccountHead = new LoadAccountHead;
   loadExpenseTypeObj: LoadExpenseType = new LoadExpenseType;
   accounts: AccountHeadItemObj[] = [];
   filteredAccountHeads:  AccountHeadItemObj[] = [];
   loaddeptObj: LoadDepartment = new LoadDepartment;
   departments: DepartmentObj[] = [];
   loadbeneficiaryObj: LoadBeneficiary = new LoadBeneficiary;
   expenseRequisitions: ExpenseRequisitionObj[] = [];
   //  beneficiaryObj: BeneficiaryObj[] = [];
   beneficiaries: BeneficiaryObj[] = [];
   expensetypes: ExpenseTypeObject[]= [];
   Role: null;
   Token: string;
   message: string;
   successDisplay: boolean;
   expId;
   expenseId;
   btnShow: boolean;
   VendorType;
   beneficiaryId: null;
   typeId;
   PriceUnit;
   QuantityObj;
   DescribeObj;
   TotalAmountObj;
   requisitArr: any[] = [];
   requisitArrB: any[] = [];
   TotalSumObj;
   RegisteredBy: number;
   helpers: Helpers = new Helpers;
  constructor( private generalService: GeneralService,
               public itemService: ExpenseItemService,
               public departmentService: DepartmentService,
               public beneficiaryService: BeneficiaryService,
               public expensetypeService: ExpenseTypeService,
               private requisitionService:  RequisitionService ) {
                }


  ngOnInit() {
    this.responseAlert = false;
    this.helpers.successDisplay = true;
    this.loading = true;
    this.paginator.num = 10;
    this.loadExpenseTypes();
    this.loadDepartment();
    this.loadExpenseItem();
    this.loadBeneficiary();
    this.successDisplay = true;
    this.VendorType = null;
    this.PriceUnit = null;
    this.Role = this.generalService.activeUser.Roles[0].RoleName;
    this.requisitionObj.SysPathCode = this.generalService.activeUser.AuthToken;
    const requisitVal = JSON.parse( window.localStorage.getItem('reqs'));
    const requisitValB = JSON.parse( window.localStorage.getItem('reqsB'));
    if (requisitValB) {
      this.requisitArrB = requisitValB;
      console.log(this.requisitArrB);
    }
    if (requisitVal) {
      this.requisitArr = requisitVal;
    }
    this.onLoadRequisitionItem();
    this.Role = this.generalService.activeUser.Roles[0].RoleName;

  }
  showAction() {
    this.Role = this.generalService.activeUser.Roles[0].RoleName;
    if (this.Role == 'PortalAdmin') {
      return true;
    }
    return false;
  }
  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

    loadExpenseItem() {
      this.loadExpenseItemObj.Status = 1;
      this.loadExpenseItemObj.SysPathCode = this.generalService.activeUser.AuthToken;

      this.itemService.loadExpenseItem(this.loadExpenseItemObj)
      .subscribe(data => {
          // console.log(data);
        if (data.Status.IsSuccessful ) {
          this.loading = false;
          this.expenseitems = data.ExpenseItems;
          // console.log(this.expenseitems)
        }
        if (!data.Status.IsSuccessful) {
            this.errorHandler(data);
        }
      });
    }

    loadDepartment() {
      this.loaddeptObj.SysPathCode = this.generalService.activeUser.AuthToken;
      this.loaddeptObj.Status = 1;
      this.departmentService.loadDepartment(this.loaddeptObj)
          .subscribe(data => {
            if (data.Status.IsSuccessful ) {
              this.loading = false;
              this.departments = data.Departments;
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
                this.expensetypes = data.ExpenseTypes;
              }
              if (!data.Status.IsSuccessful) {
                  this.errorHandler(data);
              }
            });
    }

    loadBeneficiary() {
      this.loadbeneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
      this.loadbeneficiaryObj.Status = 1;
      this.beneficiaryService.loadBeneficiaries(this.loadbeneficiaryObj)
          .subscribe(data => {
            if (data.Status.IsSuccessful ) {
              this.loading = false;
              this.beneficiaries = data.Beneficiaries;
      //        console.log(this.beneficiaries)
            }
            if (!data.Status.IsSuccessful) {
                this.errorHandler(data);
            }
          });
    }

    onChangebeneficiary(event) {
      this.beneficiaryId = event;
      if (this.beneficiaryId !== '') {
        const benfica = filter(this.beneficiaries, (item) => item.BeneficiaryId == this.beneficiaryId );
            this.VendorType = benfica[0].BeneficiaryTypeName;
            this.requisitionObj.BeneficiaryType = benfica[0].BeneficiaryType;
            this.requisitionObj.BeneficiaryId = benfica[0].BeneficiaryId;
      }
    }

    onChangeExpenseItem(id) {
      // this.expenseItemId = id;
      if (id) {
          const exp = filter( this.expenseitems, (item) => item.ExpenseItemId == id);
          this.PriceUnit = exp[0].UnitPrice;
          this.requisitionListObj.ExpenseItemId = id;
          this.requisitionListObj.UnitPrice = this.PriceUnit;
      }
    }
    getExpenseItemName(id) {
      const exp = filter( this.expenseitems, (item) => item.ExpenseItemId == id);
      if (exp[0].Name) {
        const expenseName = exp[0].Name;
        return  expenseName;
      }
    }
    onChangeExpenseType(id) {
      if (id) {
        this.requisitionListObj.ExpenseTypeId = id;
      }
    }
    getExpenseTypeName(id) {
      const exp = filter( this.expensetypes, (item) => item.ExpenseTypeId == id);
      if (exp[0].Name) {
        const expenseName = exp[0].Name;
        return  expenseName;
      }
    }

    loadBeneficiaryType() {
      this.loadbeneficiaryObj.SysPathCode = this.generalService.activeUser.AuthToken;
      this.loadbeneficiaryObj.Status = 1;

      this.beneficiaryService.loadBeneficiaryType(this.loadbeneficiaryObj)
          .subscribe(data => {
            if (data.Status.IsSuccessful ) {
              this.loading = false;
              // this.beneficiaries = data.Beneficiaries;
              this.beneficiaries = filter(data.Beneficiaries, (item) => item.BeneficiaryType == this.typeId);
            }
            if (!data.Status.IsSuccessful) {
                this.errorHandler(data);
            }
          });
    }

    triggerAdd() {
      // this.requisitionObj.RequisitionItems = [];

    }

    totalQuantity(qty) {
      if (qty > 0) {
        this.requisitionListObj.TotalAmount = qty * this.PriceUnit;
        this.TotalAmountObj = this.requisitionListObj.TotalAmount;
        this.requisitionListObj.TotalAmount =  this.TotalAmountObj;
        this.QuantityObj = qty;
        this.requisitionListObj.Quantity = this.QuantityObj;
      }
    }

    describe(disc) {
      this.DescribeObj = disc;
      this.requisitionListObj.Description = this.DescribeObj;
    }

    onChangeDepartment(id) {
      if (id) {
        this.helpers.departmentId = id;
        this.requisitionObj.DepartmentId = id;
      }
    }
    onAddNewItem(form: NgForm) {
      if (form.value) {
        this.requisitArr.push(form.value);
        window.localStorage.setItem('reqs', JSON.stringify(this.requisitArr));
        this.requisitArr = JSON.parse(window.localStorage.getItem('reqs'));
        this.requisitionObj.RequisitionItems = this.requisitArr;
        this.requisitionItemBObj.push(this.requisitionObj);
        window.localStorage.setItem('reqsB', JSON.stringify(this.requisitionItemBObj));
        this.requisitArrB = JSON.parse(window.localStorage.getItem('reqsB'));
        // console.log(this.requisitArr);
        // console.log(this.requisitionObj);
        form.reset();
      }
    }
    onClose() {
      const sumTotal = this.requisitionObj.RequisitionItems;
      const getSum = (accumulator, currentValue) => {
        return accumulator + currentValue;
      };
     const Total =  map(sumTotal, (item) => item.TotalAmount).reduce(getSum, 0);
     this.helpers.total = Total;
     if (Total) {
      this.TotalSumObj = Total;
     }
     this.TotalSumObj = this.helpers.total;
    }
    onSelect() {
      const depId = this.requisitArrB[0].DepartmentId;
      // console.log(depId, this.helpers.departmentId);
      if (depId == this.helpers.departmentId) {
        return true;
      }
      return false;
    }
    addRequisition() {
      this.helpers.showRequisit = true;
    }
    hideRequisition() {
      this.helpers.showRequisit = false;
    }

    onLoadRequisitionItem() {
      this.loadrequisitionObj.SysPathCode = this.generalService.activeUser.AuthToken;
      this.loadrequisitionObj.status = 1;
      this.requisitionService.loadRequisition(this.loadrequisitionObj)
        .subscribe(data => {
          console.log(data);
          this.expenseRequisitions = data.ExpenseRequisitions;
          // this.expenseRequisitions = filter(data.ExpenseRequisitions, (item) => {
          //   return item.RegisteredBy == 1;
          // });
          // console.log(this.expenseRequisitions);
        });

    }
    triggerView(id) {
      
    }
    onAddRequisitionItem(form: NgForm) {
      this.requisitionService.addRequisition(this.requisitionObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
         this.helpers.showButton = true;
          this.successHandler('Requisition was added successfully', form);
          window.localStorage.removeItem('reqs');
          window.localStorage.removeItem('reqsB');
          this.requisitArr = [];
          this.requisitArrB = [];
          form.reset();
          this.helpers.showRequisit = false;
          this.onLoadRequisitionItem();
        }
        if (!data.Status.IsSuccessful) {
          window.localStorage.removeItem('reqs');
          window.localStorage.removeItem('reqsB');
          this.requisitArr = [];
          this.requisitArrB = [];
          form.reset();
          this.helpers.showRequisit = true;
          this.errorHandler(data);
        }
      });
    }
    triggerDelete(id) {
      this.helpers.requisitionId = filter(this.expenseRequisitions, (item) => item.ExpenseRequisitionId == id)[0].ExpenseRequisitionId;
      this.message = 'Requisition was Deleted Successfully';
      this.helpers.successDisplay = true;
    }
    onDeleteRequisition() {
      this.deleteRequisitionObj.SysPathCode = this.generalService.activeUser.AuthToken;
      this.deleteRequisitionObj.ExpenseRequisitionId = this.helpers.requisitionId;
      this.deleteRequisitionObj.DeleteReason = '';
      this.requisitionService.deleteRequisition(this.deleteRequisitionObj)
        .subscribe(data => {
          if (data.Status.IsSuccessful) {
            this.responseAlert = true;
            this.requestPass = true;
            this.responseMessage = this.message;
            this.helpers.successDisplay = false;
            this.onLoadRequisitionItem();
            this.fadeOut();
          }
          if (!data.Status.IsSuccessful) {
            this.errorHandler(data);
          }
        });
    }
    showActive() {
      if (this.helpers.showButton === true) {
        return true;
      }
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
      this.requisitionObj = new AddRequisition();
    }

    formHasUnsavedData() {
      if (this.requisitionObj === null) {
        if (
          this.requisitionObj.Title ||
          this.requisitionObj.RequisitionItems ||
          this.requisitionObj.BeneficiaryType ||
          this.requisitionObj.DepartmentId ||
          this.requisitionObj.BeneficiaryId
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
