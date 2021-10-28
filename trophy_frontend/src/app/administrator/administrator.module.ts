import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLogoutComponent } from './admin-logout/admin-logout.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminAuthGuard } from '../data/services/admin-auth.guard';
import { AdminSharedModule } from './admin-shared/admin-shared.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminLogoutComponent
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    HttpClientModule,
    AdminSharedModule,
    SharedModule
  ],
  providers: [
    AdminAuthGuard
  ],
})
export class AdministratorModule { }
