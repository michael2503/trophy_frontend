import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorHandlerService: ErrorHandlerService,
  ) {
    this.baseUrl = configService.base_url();
  }

  getWithdrawals(limit = 20, page = 1) {
    return this.http.get<any>(
      `${this.baseUrl}user/withdrawal/${limit}/${page}`
    ).pipe(tap(res => {
    }, err => {
      this.errorHandlerService.errorResp.next(err);
    }));
  }

  getWalletInfo() {
    return this.http.get<any>(
      `${this.baseUrl}user/wallet`
    ).pipe(tap(res => { }, err => {
      this.errorHandlerService.errorResp.next(err);
    }));
  }

  fundWallet(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/wallet/credit`,
      data
    );
  }

  withdraw(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/withdrawal/request`,
      data
    )
  }
}
