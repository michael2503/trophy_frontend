import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { TestimonialComponent } from './pages/testimonial/testimonial.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DynamicStaticComponent } from './pages/static/dynamic-static/dynamic-static.component';
import { AboutComponent } from './pages/static/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    HomeComponent,
    TestimonialComponent,
    ContactUsComponent,
    DynamicStaticComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    SharedModule
  ]
})
export class GuestModule { }
