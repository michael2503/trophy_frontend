import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutComponent } from './pages/static/about/about.component';
import { TestimonialComponent } from './pages/testimonial/testimonial.component';
import { DynamicStaticComponent } from './pages/static/dynamic-static/dynamic-static.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  // guest pages url path
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'testimonial', component: TestimonialComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'pages/:url', component: DynamicStaticComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
