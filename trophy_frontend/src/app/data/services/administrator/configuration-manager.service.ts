import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';

@Injectable({ providedIn: 'root' })
export class ConfigurationManagerService {
  private serverUrl: string;
  private adminUrl: string;
  private token: string;

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

  getConfiguration() {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/configuration_manager/getConfiguration/' +
      this.token
    );
  }

  update_configuration(data: string) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/update-configuration/' + this.token, data
    );
  }


  updateSettings(data: string) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/update-web-settings/' + this.token, data
    );
  }

}
