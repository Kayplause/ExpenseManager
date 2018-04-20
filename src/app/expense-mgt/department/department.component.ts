import { DepartmentService } from './../../services/department.service';
import { GeneralService } from './../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, map, indexOf, toArray } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AddDepartment, LoadDepartment, DeleteDepartment, UpdateDepartment} from './../../request-objects/department';
import { DepartmentObj } from './../../response-objects/department-response';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  animations: [
    trigger('flipInOut', [

      state('in', style({ display: 'block' })),
      state('out', style({ display: 'none' })),

      transition('in => out', animate('1ms', style({ transform: 'translateX(-50px)' }))),
      transition('out => in', animate('100ms', style({ transform: 'translateX(-50px)' })))
    ])
  ]
})

export class DepartmentComponent implements OnInit {
  working: boolean; // indicate background process(es) with neccessary effects @ the frontend
  stateA = 'in'; // animation state that displays the submit button and hides the status button
  stateB = 'out'; // animation state that hides the submit button and show the status button
  responseAlert: boolean; // display response alert for user
  responseMessage: string; // holds message to display for user
  requestPass: boolean; // indicates successful user query
  loading: boolean; // indicates loading process
  page = 1; // ngx-pagination property to indicate current page
  paginator = { num: null }; // ngx-pagination count
   deptObj: AddDepartment = new AddDepartment;
   loaddebtObj: LoadDepartment = new LoadDepartment;
   editdeptObj: UpdateDepartment = new UpdateDepartment;
   deletedeptObj: DeleteDepartment = new DeleteDepartment;
   departments: DepartmentObj[] = [];
   Token: string;
   message: string;
   successDisplay: boolean;

  constructor( private generalService: GeneralService,
               private departmentService: DepartmentService) { }

  ngOnInit() {
      this.loading = true;
      this.paginator.num = 10;
      this.successDisplay = true;
      this.loadDepartment();
  }

  fadeOut() {
    setTimeout(() => {
      this.responseAlert = false;
    }, 5000);
  }

  loadDepartment() {
    this.loaddebtObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.loaddebtObj.Status = -2;

    this.departmentService.loadDepartment(this.loaddebtObj)
        .subscribe(data => {
          if (data.Status.IsSuccessful ) {
            this.loading = false;
            this.departments = filter(data.Departments, (item) => {
              return item.StatusLabel === 'Active' || item.StatusLabel === 'InActive';
          });
          if (!data.Status.IsSuccessful) {
              this.errorHandler(data);
          }
        }
      });
    }

  triggerAdd() {
    this.deptObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'Department Added Successfully';
    // console.log(this.alertCodeObj)

  }

  triggerEdit(id) {
    if (id) {
      this.message = 'New Department was Updated Successfully';
      const dept = filter(this.departments, (item) => item.DepartmentId == id)[0];
      this.editdeptObj.Name = dept.Name;
      this.editdeptObj.DepartmentId = id;
      this.editdeptObj.Status = dept.Status;
      this.editdeptObj.SysPathCode = this.generalService.activeUser.AuthToken;
    }

  }
  triggerDelete(id, name) {
    this.successDisplay = true;
    this.editdeptObj.Name = name;
    this.deletedeptObj.DepartmentId = id;
    this.deletedeptObj.SysPathCode = this.generalService.activeUser.AuthToken;
    this.message = 'New Department was Deleted Successfully';
  }

  onAddDepartment(form: NgForm) {

    this.deptObj.Status = ( form.value.Status == true) ? 1 : 0 ;
 //   console.log(this.deptObj);
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button
    this.departmentService.addDepartment(this.deptObj)
      .subscribe(data => {
   //     console.log(data);
        if (data.Status.IsSuccessful) {
          this.successHandler(this.message, form);
          this.loadDepartment();
        }
        if (!data.Status.IsSuccessful) {}
        this.errorHandler(data);
      });
  }

  onEditDepartment(form: NgForm) {
    this.editdeptObj.Status = (form.value.Status == true) ? 1 : 0;
    this.stateA = 'out'; // hide the submit button while processing form
    this.stateB = 'in'; // display the status button

    this.departmentService.updateDepartment(this.editdeptObj)
      .subscribe(data => {
        if (data.Status.IsSuccessful) {
          this.responseAlert = true;
          this.requestPass = true;
          this.responseMessage = this.message;
          this.loadDepartment();
          this.fadeOut();
          this.stateA = 'in';
          this.stateB = 'out';
        }
        if (!data.Status.IsSuccessful) {
          this.errorHandler(data);
        }
      });
  }

  onDeleteDepartment() {
    this.departmentService.deleteDepartment(this.deletedeptObj)
    .subscribe(data => {
      if (data.Status.IsSuccessful) {
        this.responseAlert = true;
        this.requestPass = true;
        this.responseMessage = this.message;
        this.successDisplay = false;
        this.loadDepartment();
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
    this.deptObj = new AddDepartment();
  }

  formHasUnsavedData() {
    if (this.deptObj === null) {
      if (this.deptObj.Name) {
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
