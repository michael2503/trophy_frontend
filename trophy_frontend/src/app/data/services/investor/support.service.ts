import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorHandlerService: ErrorHandlerService,
  ) {
    this.baseUrl = configService.base_url();
  }

    getSupports(status, limit = 10, page = 1) {
        return this.http.get<any>(
        this.baseUrl + '/user/support/' + status + '/' + limit + '/' + page
        ).pipe(tap(res => {
        }, err => {
            this.errorHandlerService.errorResp.next(err);
        }));
    }


    supportSingle(id) {
        return this.http.get<any>(
        this.baseUrl + 'user/support/single/' + id
        ).pipe(tap(res => {
        }, err => {
            this.errorHandlerService.errorResp.next(err);
        }));
    }

    composeSupport(data: string) {
        return this.http.post<any>(
          this.baseUrl + '/user/support/compose', data
        );
    }

}
