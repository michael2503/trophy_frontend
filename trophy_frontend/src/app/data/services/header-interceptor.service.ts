import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {
  token;
  constructor(
    private authService: AuthService
  ) {
    authService.investor.subscribe(auth => {
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
          'Api-Token': this.token
        }
      }));
    }
    return next.handle(req);
  }
}
