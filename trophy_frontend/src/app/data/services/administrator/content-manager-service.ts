import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';

@Injectable({ providedIn: 'root' })
export class ContentManagerService {
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

  slidersByAdmin() {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/home-banner/' + this.token
    );
  }
  
  whoWeCallTo() {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/who-we-call-to/' + this.token
    );
  }

  addSlide(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.post<any>(
      this.serverUrl + 'sliders/addSlide/' + this.token,
      {data: postData}
    );
  }

  updateSlider(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/' +'home-banner/update/' + this.token, postData
    );
  }

  singleSlide(id) {
    return this.http.get<any>(
      this.serverUrl + 'sliders/slide/' + this.token + '/' + id
    );
  }

  delete(id) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.get<any>(
      this.serverUrl + 'sliders/delete/' + this.token + '/' + id
    );
  }

  updateAboutUs(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/' + 'update-about-us/' + this.token, postData
    );
  }
  
  
  updateWhoWeAre(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/' + 'update-who-we-are/' + this.token, postData
    );
  }
  
  updateCallToAction(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/' + 'update-call-to-action/' + this.token, postData
    );
  }


  // EMAIL TEMPLATE
  getAll() {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/email-template/' + this.token
    );
  }

  updateEmailTemplate(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/' +'email-template/update/' + this.token, postData
    );
  }


  getClient() {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/client/' + this.token
    );
  }

  deleteClient(id) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/client/delete/' + this.token + '/' + id
    );
  }

  addClient(postData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/client/add/' + this.token, postData
    );
  }

}
