"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var AuthService = /** @class */ (function () {
    function AuthService(platformId, http, config, routingService, storageService) {
        this.platformId = platformId;
        this.http = http;
        this.config = config;
        this.routingService = routingService;
        this.storageService = storageService;
        this._client = new rxjs_1.BehaviorSubject(null);
        this.serverUrl = this.config.base_url();
    }
    Object.defineProperty(AuthService.prototype, "client", {
        get: function () {
            return this._client.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    // Become freelancer
    AuthService.prototype.signup = function (postData) {
        return this.http.post(this.serverUrl + 'register/signup', { data: postData, location: location });
    };
    AuthService.prototype.signUpEmail = function (email) {
        return this.http
            .post(this.serverUrl + 'register/validate_email', email);
    };
    AuthService.prototype.signUpUsername = function (postData, email) {
        var location;
        // this.visitorService.userLocation.subscribe(resp => {
        //   location = resp;
        // });
        return this.http
            .post(this.serverUrl + 'register/process_signup', { data: postData, email: email, location: location });
    };
    AuthService.prototype.socialSignup = function (postData, socialData, email) {
        var location;
        // this.visitorService.userLocation.subscribe(resp => {
        //   location = resp;
        // });
        return this.http
            .post(this.serverUrl + 'register/social_signup', { data: postData, socialData: socialData, email: email, location: location });
    };
    AuthService.prototype.login = function (email, password) {
        return this.http
            .post(this.serverUrl + 'login/authenticate/', { user: email, password: password });
    };
    AuthService.prototype.socialLogin = function (userData) {
        return this.http
            .post(this.serverUrl + 'login/socialLogin/', userData);
    };
    AuthService.prototype.logout = function () {
        this._client.next(null);
        localStorage.clear();
        this.routingService.replace(['/']);
    };
    AuthService.prototype.logoutAlt = function () {
        this._client.next(null);
        this.storageService.remove('userData');
    };
    // autoLogin() {
    //   if (!this.storageService.hasKey('userData')) {
    //     return of(false);
    //   }
    //   const userData = JSON.parse(this.storageService.getString('userData'));
    //   if (userData) {
    //     if (!this.checkAuthStatus(userData)) {
    //       return of(false);
    //     }
    //     this._client.next(userData);
    //     return of(true);
    //   }
    //   return of(false);
    //   // } 
    //   // else {
    //   //   return of(false);
    //   // }
    // }
    AuthService.prototype.checkAuthStatus = function (auth) {
        if (auth.hasOwnProperty('authAge')) {
            var authAge = auth['authAge'];
            var hourMs = 60 * 60 * 1000;
            if (Date.now() - authAge >= hourMs) {
                return false;
            }
            return true;
        }
        return true;
    };
    // Used within and outside
    AuthService.prototype.storeAuthData = function (auth) {
        if (auth.status == 0) {
            auth['authAge'] = Date.now();
        }
        else {
            if (auth.hasOwnProperty('authAge')) {
                delete auth['authAge'];
            }
        }
        this.storageService.storeString('userData', JSON.stringify(auth));
        // this.adminAuthService.storeAdminAuthData(null);
        this._client.next(auth);
    };
    AuthService = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __param(0, core_1.Inject(core_1.PLATFORM_ID))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
