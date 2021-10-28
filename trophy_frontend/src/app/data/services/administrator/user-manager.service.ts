import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';

@Injectable({ providedIn: 'root' })
export class UserManagerService {
  private serverUrl: string;
  private adminUrl: string;
  private token: string;
  private _users = new BehaviorSubject<any>(null);
  private _user = new BehaviorSubject<any>(null);
  private subject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private adminAuthService: AdminAuthService
  ) {
    this.serverUrl = this.config.base_url();
    this.adminUrl = this.config.adminBackUrl;
    this.adminAuthService.admin.subscribe(auth => {
      if (auth) { this.token = auth.token; }
    });
  }

  get customer() {
    return this._user;
  }

  setStatus(status: string) {
    this.subject.next(status);
  }

  get getStatus(): Observable<any> {
    return this.subject.asObservable();
  }

  getCustomers(role = 'all', limit = 10, page = 1) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user/' + this.token + '/' + role + '/' + limit + '/' + page
    );
  }

  getCustomer(userID: string) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user/single/' + this.token + '/' + userID
    );
  }

  accountAction(userID: number, action: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user/account-action/' + this.token + '/' + userID + '/' + action
    );
  }

  updateUser(msgData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/user/update/' + this.token, msgData
    );
  }  
  
  popAction(loginID: number, action: any) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user_manager/provePaymentActions/' +
      this.token + '/' + loginID + '/' + action
    );
  }

  search(keywords) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user_manager/search/' +
      this.token + '/' + keywords
    );
  }

  activatedUser(limit = 10, page = 1) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user_manager/activated/' +
      this.token + '/' + limit + '/' + page
    );
  }


}
