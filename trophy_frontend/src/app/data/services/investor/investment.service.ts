import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private config: ConfigService,
  ) {
    this.baseUrl = config.base_url();
  }

  getInvestmentInfo() {
    return this.http.get<any>(
      `${this.baseUrl}user/investment/plan`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }))
  }

  getInvestments() {
    return this.http.get<any>(
      `${this.baseUrl}user/investment`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }))
  }

  invest(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/investment/create`,
      data
    )
  }

  single(id) {
    return this.http.get<any>(
      `${this.baseUrl}user/investment/history/${id}`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }

  getInvGuest() {
    return this.http.get<any>(
      `${this.baseUrl}/investments`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }

  generateInvoice(invID: number) {
    // return this.http.get<any>(
    //   this.baseUrl + 'user/investment/generateInvoice'
    // );

    return this.http.get<any>(
      `${this.baseUrl}user/investment/generateInvoice`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }

}
