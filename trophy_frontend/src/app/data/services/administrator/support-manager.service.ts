import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';

@Injectable({ providedIn: 'root' })
export class SupportManagerService {
    private serverUrl: string;
    private adminUrl: string;
    private token: string;
    private _supports = new BehaviorSubject<any>(null);
    private _support = new BehaviorSubject<any>(null);

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

    get testimonials() {
        return this._supports.asObservable();
    }


    getAllSupport(status, limit = 10, page = 1) {
        return this.http.get<any>(
            this.serverUrl + this.adminUrl + '/support/' + this.token + '/' + status + '/' + limit + '/' + page
        );
    }


    single(supID: number) {
        return this.http.get<any>(
            this.serverUrl + this.adminUrl + '/support/single/' + this.token + '/' + supID
        ).pipe(tap(resData => {
            if (resData) {
                this._support.next(resData);
            }
        }));
    }


    deleteSupport(testID: number) {
        if (this.config.isDemo) {
        alert('Oops you can not update record on demo version.');
        return of(false);
        }
        return this.http.delete<any>(
            this.serverUrl + this.adminUrl + '/support/delete/' + this.token + '/' + testID
        );
    }


    composeSupport( msgData: string) {
        if (this.config.isDemo) {
        alert('Oops you can not update record on demo version.');
        return of(false);
        }
        return this.http
        .post<any>(
            this.serverUrl + this.adminUrl + '/support/compose/' + this.token, msgData
        );
    }

}
