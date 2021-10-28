import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TestimonyComponent } from './pages/testimony/testimony.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
// import { SupportComponent } from './pages/support/support.component';
import { SupportSingleComponent } from './pages/support-single/support-single.component';
import { UserRoutingModule } from './user-routing.module';
import { VerifyPhoneComponent } from './pages/verify-phone/verify-phone.component';
import { SupportComponent } from './pages/support/support.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TestimonyComponent,
    SettingsComponent,
    VerifyEmailComponent,
    VerifyPhoneComponent,
    SupportComponent,
    SupportSingleComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
