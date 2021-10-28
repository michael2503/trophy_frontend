import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TestimonyComponent } from './pages/testimony/testimony.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { SupportComponent } from './pages/support/support.component';
import { SupportSingleComponent } from './pages/support-single/support-single.component';
import { VerifyPhoneComponent } from './pages/verify-phone/verify-phone.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'testimony', component: TestimonyComponent },
  { path: 'settings', redirectTo: '/user/settings/profile-settings', pathMatch: 'full' },
  { path: 'settings/:url', component: SettingsComponent },
  { path: 'email-verification', component: VerifyEmailComponent },
  { path: 'phone-verification', component: VerifyPhoneComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/unread', component: SupportComponent },
  { path: 'support/read', component: SupportComponent },
  { path: 'support/single/:id', component: SupportSingleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
