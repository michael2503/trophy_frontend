import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorHandlerService: ErrorHandlerService,
  ) {
    this.baseUrl = configService.base_url();
  }

  getRefarral(limit = 20, page = 1) {
    return this.http.get<any>(
      `${this.baseUrl}user/referral/${limit}/${page}`
    ).pipe(tap(res => {
    }, err => {
      this.errorHandlerService.errorResp.next(err);
    }));
  }

}
