import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TestimonyService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.baseUrl = config.base_url();
  }

  postTestimony(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/testimony/create`,
      data
    );
  }

  testimonies() {
    return this.http.get<any>(
      `${this.baseUrl}testimony`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }

  getUserTestimony() {
    return this.http.get<any>(
      `${this.baseUrl}user/testimony`
    ).pipe(tap(res => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }
}
