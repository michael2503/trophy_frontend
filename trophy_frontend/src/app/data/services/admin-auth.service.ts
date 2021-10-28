import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';

import { ConfigService } from './config.service';
import { RoutingService } from '../helpers/routing.service';
import { StorageService } from '../helpers/storage.service';
import { tap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private serverUrl: string;
  private _admin = new BehaviorSubject<any>(null);
  checking = new BehaviorSubject(true);

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private routingService: RoutingService,
    private storageService: StorageService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.serverUrl = this.config.base_url();
  }

  get admin() {
    return this._admin.asObservable();
  }

  // login(data) {
  //   if (data) {
  //     return this.http.post<any>(
  //       this.serverUrl + 'admin/login', data
  //     ).pipe(tap(auth => {
  //       if (auth) {
  //         this.storeAdminAuthData(auth);
  //       }
  //     }, err => {
  //       this.errorHandler.errorResp.next(err);
  //     }));
  //   }
  // }

  login(data) {
    return this.http
      .post<any>(
        `${this.serverUrl}admin/login`,
        data
      ).pipe(tap(auth => {
        if (auth) {
          this.storeAdminAuthData(auth);
        }
      }, err => {
        this.errorHandler.errorResp.next(err);
      }));
  }

  logout(id) {
    this.http.delete<any>(
      this.serverUrl + '/admin/logout/' + id
    );
    this._admin.next(null);
    this.storageService.remove('adminData');
    this.routingService.replace([
      '/' + this.config.adminURL + '/login'
    ]);
  }

  async autoLogin() {
    this.checking.next(true);
    const adminData = JSON.parse(await this.storageService.getString('adminData'));
    this._admin.next(adminData);
    this.checking.next(false);
    return;
  }

  // Used within and outside
  storeAdminAuthData(adminAuth: any) {
    this.storageService.storeString('adminData', JSON.stringify(adminAuth));
    this._admin.next(adminAuth);
  }


  // storeAuthData(auth: any) {
  //   this.storageService.storeString('userData', JSON.stringify(auth));
  //   this._investor.next(auth);
  // }
}
