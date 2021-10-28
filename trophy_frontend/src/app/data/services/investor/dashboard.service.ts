import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.baseUrl = configService.base_url();
  }

  getInfo() {
    return this.http.get<any>(
      `${this.baseUrl}user/dashboard`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }
}
