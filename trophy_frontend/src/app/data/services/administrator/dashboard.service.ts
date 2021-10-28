import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl;
  private token: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorHandler: ErrorHandlerService,
    private adminAuthService: AdminAuthService,
  ) {
    this.baseUrl = configService.base_url();
    this.adminAuthService.admin.subscribe(auth => {
      if (auth) { this.token = auth.token; }
    });
  }

  getInfo() {
    return this.http.get<any>(
      // `${this.baseUrl}admin/dashboard`
      this.baseUrl + 'admin/dashboard/' + this.token
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }
}
