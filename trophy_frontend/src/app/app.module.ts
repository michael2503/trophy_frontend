import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminAuthGuard } from './data/services/admin-auth.guard';
import { AuthGuard } from './data/services/auth.guard';
import { HeaderInterceptorAdminService } from './data/services/header-interceptor-admin.service';
import { HeaderInterceptorService } from './data/services/header-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorService,
      multi: true
    },
    AdminAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorAdminService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
