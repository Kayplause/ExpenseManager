import { RequistionItemComponent } from './expense-mgt/requistion-item/requistion-item.component';
import { DepartmentComponent } from './expense-mgt/department/department.component';
import { BeneficiaryComponent } from './expense-mgt/beneficiary/beneficiary.component';
import { ExpenseItemComponent } from './expense-mgt/expense-item/expense-item.component';
import { ExpenseTypeComponent } from './expense-mgt/expense-type/expense-type.component';
import { AccountHeadComponent } from './expense-mgt/account-head/account-head.component';

import { ExpenseMgtComponent } from './expense-mgt/expense-mgt.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { EditProfileComponent } from './user-profile/edit-profile/edit-profile.component';
import { ManageUsersComponent } from './site-admin/manage-users/manage-users.component';
import { ResetPasswordComponent } from './site-admin/reset-password/reset-password.component';
import { ManageRolesComponent } from './portal-admin/manage-roles/manage-roles.component';
import { ManageTabsComponent } from './portal-admin/manage-tabs/manage-tabs.component';
import { Page404Component } from './page-404/page-404.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { HomepageComponent } from './homepage/homepage.component';

import { ExpenseCategoryComponent } from './expense-mgt/expense-category/expense-category.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthoutService } from './services/authout.service';

const routes: Routes = [
  { path: 'login', component: LoginpageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'},

  { path: 'home', component: HomepageComponent,
    canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'dashboard', component: DashboardComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'RoleMgt', component: ManageRolesComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'UserMgt', component: ManageUsersComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'TabMgt', component: ManageTabsComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },
  {
    path: 'PassReset', component: ResetPasswordComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'user/edit-profile', component: EditProfileComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'user/change-password', component: ChangePasswordComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'expense-mgt', component: ExpenseMgtComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'account-head', component: AccountHeadComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'expense-category', component: ExpenseCategoryComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'expense-type', component: ExpenseTypeComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'expense-item', component: ExpenseItemComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'department', component: DepartmentComponent,
  canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'beneficiary', component: BeneficiaryComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: 'requisition-item', component: RequistionItemComponent,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },

  { path: '**', component: Page404Component }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
