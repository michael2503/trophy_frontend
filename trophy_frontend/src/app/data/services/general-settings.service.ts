import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { StorageService } from '../helpers/storage.service';
import { ConfigService } from './config.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {
  private baseUrl;
  private settings = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private storageService: StorageService,
    private errorService: ErrorHandlerService,
  ) {
    this.baseUrl = this.config.base_url();
  }

  get genSettings() {
    return this.settings.asObservable();
  }

  getGenSettings() {
    return this.http.get<any>(
      `${this.baseUrl}general_settings`
    ).pipe(tap(res => {
      this.settings.next(res.data);
      // const genSettings = { time: Date.now(), data: res };
      // this.storageService.storeString('generalSettingsData', JSON.stringify(genSettings));
      // this.settings.next(res);
    }, err => {
      this.errorService.errorResp.next(err);
    }));
  }

  updateSettings(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.post<any>(
      `${this.baseUrl}admin/update-web-settings/`, postData
    );
  }

  // getSettings() {
  //   if (this.storageService.hasKey('generalSettingsData')) {
  //     const genSettings = JSON.parse(this.storageService.getString('generalSettingsData'));
  //     if (Date.now() - genSettings.time > 4 * 60 * 60 * 1000) {
  //       this.serverRequest();
  //     } else {
  //       this.settings.next(genSettings.data);
  //     }
  //   } else {
  //     this.serverRequest();
  //   }
  // }
}
