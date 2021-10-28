import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from './admin-auth.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorAdminService implements HttpInterceptor {
  token;
  constructor(
    private adminAuthService: AdminAuthService
  ) {
    adminAuthService.admin.subscribe(auth => {
      if (auth) {
        this.token = auth.token;
      } else {
        this.token = null;
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.token) {
      return next.handle(req.clone({
        setHeaders: {
          'admin_token': this.token
        }
      }));
    }
    return next.handle(req);
  }
}
