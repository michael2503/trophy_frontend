import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BankInfoService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.baseUrl = config.base_url();
  }

  addBank(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/account-settings/update-bank`,
      data,
    )
  }

  getBankInfo() {
    return this.http.get<any>(
      `${this.baseUrl}user/account-settings/bank`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }))
  }
}
