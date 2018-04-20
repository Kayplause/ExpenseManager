import { ExpenseItemService } from './services/expense-item.service';
import { DepartmentService } from './services/department.service';
import { ExpenseTypeService } from './services/expense-type.service';
import { AccountHeadService } from './services/account-head.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './services/app-interceptor';
import { CustomFormsModule } from 'ng2-validation';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { RoutingModule } from './/routing.module';
import { HeaderService } from './services/header.service';
import { GeneralService } from './services/general.service';
import { AuthService } from './services/auth.service';
import { AuthoutService } from './services/authout.service';
import { TitleBarComponent } from './nav-menu/title-bar/title-bar.component';
import { SidebarLeftComponent } from './nav-menu/sidebar-left/sidebar-left.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { Page404Component } from './page-404/page-404.component';
import { LoginService } from './services/login.service';
import { PaginationComponent } from './pagination/pagination.component';
import { ManageRolesComponent } from './portal-admin/manage-roles/manage-roles.component';
import { ManageTabsComponent } from './portal-admin/manage-tabs/manage-tabs.component';
import { ManageUsersComponent } from './site-admin/manage-users/manage-users.component';
import { ResetPasswordComponent } from './site-admin/reset-password/reset-password.component';
import { EditProfileComponent } from './user-profile/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { UsermgtService } from './services/usermgt.service';
import { PortalmgtService } from './services/portalmgt.service';

import { ExpenseMgtComponent } from './expense-mgt/expense-mgt.component';
import { AccountHeadComponent } from './expense-mgt/account-head/account-head.component';
import { ExpenseTypeComponent } from './expense-mgt/expense-type/expense-type.component';
import { ExpenseItemComponent } from './expense-mgt/expense-item/expense-item.component';
import { BeneficiaryComponent } from './expense-mgt/beneficiary/beneficiary.component';
import { ExpenseCategoryService } from './services/expense-category.service';
import { ExpenseCategoryComponent } from './expense-mgt/expense-category/expense-category.component';
import { DepartmentComponent } from './expense-mgt/department/department.component';
import { BeneficiaryService } from './services/beneficiary.service';
import { RequistionItemComponent } from './expense-mgt/requistion-item/requistion-item.component';
import { RequisitionService } from './services/requisition.service';
import { ExpenseComponent } from './expense/expense.component';


@NgModule({
  declarations: [
    AppComponent,
    BeneficiaryComponent,
    ExpenseItemComponent,
    ExpenseTypeComponent,
    ExpenseCategoryComponent,
    AccountHeadComponent,
    ExpenseMgtComponent,
    HomepageComponent,
    LoginpageComponent,
    Page404Component,
    ManageRolesComponent,
    ManageTabsComponent,
    ManageUsersComponent,
    ResetPasswordComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    TitleBarComponent,
    SidebarLeftComponent,
    DashboardComponent,
    PaginationComponent,
    DepartmentComponent,
    RequistionItemComponent,
    ExpenseComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RoutingModule,
    ChartsModule,
    NgxPaginationModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    CustomFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true},
     HeaderService, ExpenseTypeService,  DepartmentService, BeneficiaryService,
     AccountHeadService, GeneralService, ExpenseCategoryService, ExpenseItemService, AuthService, AuthoutService,
     LoginService, UsermgtService, PortalmgtService, RequisitionService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
