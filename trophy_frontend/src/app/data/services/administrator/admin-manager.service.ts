import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';

@Injectable({ providedIn: 'root' })
export class AdminManagerService {
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

  getAll(limit = 10, page = 1) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/admin-manager/all/' + this.token + '/' + limit + '/' + page
    );
  }

  getLogin_activities(limit = 10, page = 1) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/admin_manager/login_activities/' +
      this.token + '/' + limit + '/' + page
    );
  }

  dashboard(limit = 10, page = 1) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/admin_manager/dashboard/' +
      this.token + '/' + limit + '/' + page
    );
  }

  getSingle(admID: string) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/admin-manager/single/' + this.token + '/' + admID
    );
  }

  createAdmin(msgData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/admin-manager/add/' + this.token, msgData
    );
  }

  updateRecord(msgData: string, role: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/admin-manager/update/' + this.token + '/' + role, msgData
    ).pipe(tap(res => {
      if(role == 'profile'){
        if (res && res.id) {
          this.adminAuthService.storeAdminAuthData(res);
        }
      }
    }))
  }

  changePassword(msgData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/admin-manager/change-password/' + this.token, msgData
    );
  }


  delete(admID) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/admin-manager/delete/' + this.token + '/' + admID
    );
  }

}
