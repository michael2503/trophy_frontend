import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../config.service';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';

@Injectable({ providedIn: 'root' })
export class TestimonialManagerService {
  private serverUrl: string;
  private adminUrl: string;
  private token: string;
  private _testimonials = new BehaviorSubject<any>(null);
  private _testimonial = new BehaviorSubject<any>(null);

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
    return this._testimonials.asObservable();
  }

  // get job() {
  //   return this._testimonial.asObservable();
  // }

  getTestimonials(limit = 10, page = 1) {
      return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/testimonial/' + this.token + '/' + limit + '/' + page
      )
      .pipe(
      tap(resData => {
          if (resData) {
          this._testimonials.next(resData);
          }
      }));
  }

  deleteTestimonial(testID: number) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.delete<any>(
        this.serverUrl + this.adminUrl + '/testimonial/delete/' + this.token + '/' + testID
    );
  }



  single(testID: number) {
      return this.http.get<any>(
          this.serverUrl + this.adminUrl + '/testimonial/single/edit/' + this.token + '/' + testID
      ).pipe(tap(resData => {
          if (resData) {
              this._testimonial.next(resData);
          }
      }));
  }

  updateTestimonial( msgData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.put<any>(
        this.serverUrl + this.adminUrl + '/testimonial/update/' + this.token, msgData
      );
  }

  addTestimony( msgData: string) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http
      .post<any>(
        this.serverUrl + this.adminUrl + '/testimonial_manager/addtestimony/' +
        this.token, { data: msgData }
      );
  }

  

  


  deleteSocialSet(mediaID: number) {
    if (this.config.isDemo) {
      alert('Oops you can not update record on demo version.');
      return of(false);
    }
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/testimonial_manager/deleteSocailSettings/' +
        this.token + '/' + mediaID
    );
  }

}
