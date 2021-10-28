import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { StorageService } from '../../helpers/storage.service';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private baseUrl;
    private _homeData = new BehaviorSubject<any>(null);

    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private storageService: StorageService,
        private errorService: ErrorHandlerService,
    ) {
        this.baseUrl = this.config.base_url();
    }

    get homeData() {
        return this._homeData.asObservable();
    }

    getHomeData() {
        return this.http.get<any>(`${this.baseUrl}contents`).pipe(tap(res => {
            this._homeData.next(res);
        }, err => {
            this.errorService.errorResp.next(err);
        }));
    }
}
