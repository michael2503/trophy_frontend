import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, of } from 'rxjs';

import { ConfigService } from './config.service';
import { RoutingService } from '../helpers/routing.service';
import { StorageService } from '../helpers/storage.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private serverUrl: string;
  private _investor = new BehaviorSubject<any>(null);
  private token: string;
  checking = new BehaviorSubject(true);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private config: ConfigService,
    private routingService: RoutingService,
    private storageService: StorageService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.serverUrl = this.config.base_url();
  }

  get investor() {
    return this._investor.asObservable();
  }

  // Become freelancer
  signup(postData: string) {
    return this.http.post<any>(
      `${this.serverUrl}register`,
      postData
    ).pipe(tap(res => {
      if (res && res.data) {
        this.storeAuthData(res.data);
      }
    }));
  }

  signUpEmail(email: string) {
    return this.http
      .post<string>(
        this.serverUrl + 'register/validate_email', email
      );
  }

  forgotPassEmailVerify(data) {
    return this.http.post<any>(
      `${this.serverUrl}forgot-password`,
      data
    );
  }

  forgotPassReset(data) {
    return this.http.post<any>(
      `${this.serverUrl}forgot-password/reset-password`,
      data
    );
  }

  forgotPassCodeVerify(data) {
    return this.http.post<any>(
      `${this.serverUrl}forgot-password/submit-token`,
      data
    );
  }

  signUpUsername(postData: string, email: string) {
    let location;
    // this.visitorService.userLocation.subscribe(resp => {
    //   location = resp;
    // });
    return this.http
      .post<any>(
        this.serverUrl + 'register/process_signup',
        { data: postData, email: email, location: location }
      );
  }

  socialSignup(postData: string, socialData: string, email: string) {
    let location;
    // this.visitorService.userLocation.subscribe(resp => {
    //   location = resp;
    // });
    return this.http
      .post<any>(
        this.serverUrl + 'register/social_signup',
        { data: postData, socialData: socialData, email: email, location: location }
      );
  }

  changePass(data) {
    return this.http.post<any>(
      `${this.serverUrl}user/account-settings/change-password`,
      data
    )
  }

  login(data) {
    return this.http
      .post<any>(
        `${this.serverUrl}login`,
        data
      ).pipe(tap(auth => {
        if (auth) {
          this.storeAuthData(auth);
        }
      }, err => {
        this.errorHandler.errorResp.next(err);
      }));
  }

  socialLogin(userData: string) {
    return this.http
      .post<any>(
        this.serverUrl + 'login/socialLogin/', userData
      );
  }

  logout() {
    this._investor.next(null);
    localStorage.clear();
    this.routingService.replace(['/']);
  }

  verifyEmail(data) {
    return this.http.post<any>(
      `${this.serverUrl}user/account-settings/email-verify`,
      data
    ).pipe(tap(res => {
      if (res && res.id) {
        this.storeAuthData(res);
      }
    }));
  }
  
  verifyPhone(data) {
    return this.http.post<any>(
      `${this.serverUrl}user/account-settings/phone-verify`,
      data
    ).pipe(tap(res => {
      if (res && res.id) {
        this.storeAuthData(res);
      }
    }));
  }

  resendEmailCode() {
    return this.http.get<any>(
      `${this.serverUrl}user/account-settings/resend-token`
    ).pipe(tap(_ => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }
  
  resendPhoneCode() {
    return this.http.get<any>(
      `${this.serverUrl}user/account-settings/resend-phone-token`
    ).pipe(tap(_ => { }, err => {
      this.errorHandler.errorResp.next(err);
    }));
  }

  logoutAlt() {
    this._investor.next(null);
    this.storageService.remove('userData');
  }

  updateProfile(data) {
    return this.http.post<any>(
      `${this.serverUrl}user/account-settings/profile`,
      data
    ).pipe(tap(res => {
      if (res && res.id) {
        this.storeAuthData(res);
      }
    }))
  }

  async autoLogin() {
    this.checking.next(true);
    const userData = JSON.parse(await this.storageService.getString('userData'));
    this._investor.next(userData);
    this.checking.next(false);
    return;

    if (userData) {
      // if (!this.checkAuthStatus(userData)) {
      //   return of(false);
      // }
      this._investor.next(userData);
      return of(true);
    }
    return of(false);
    // } 
    // else {
    //   return of(false);
    // }
  }

  checkAuthStatus(auth): boolean {
    if (auth.hasOwnProperty('authAge')) {
      let authAge = auth['authAge'];
      let hourMs = 60 * 60 * 1000;
      if (Date.now() - authAge >= hourMs) {
        return false;
      }
      return true;
    }
    return true;

  }



  // Used within and outside
  storeAuthData(auth: any) {
    // if (auth.status == 0) {
    //   auth['authAge'] = Date.now();
    // } else {
    //   if (auth.hasOwnProperty('authAge')) {
    //     delete auth['authAge'];
    //   }
    // }
    this.storageService.storeString('userData', JSON.stringify(auth));
    // this.adminAuthService.storeAdminAuthData(null);
    this._investor.next(auth);
  }



  //
  // private updateOnlineStatus(token: string) {
  //   return this.http
  //     .get<any>(
  //       this.serverUrl + 'user/profile/onlineStatus/' + token
  //     );
  // }
}
