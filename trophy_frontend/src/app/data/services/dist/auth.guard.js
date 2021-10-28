"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthGuard = void 0;
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router, routingService, storageService) {
        this.authService = authService;
        this.router = router;
        this.routingService = routingService;
        this.storageService = storageService;
    }
    AuthGuard.prototype.canLoad = function (route, segments) {
        var _this = this;
        return this.authService.client.pipe(operators_1.take(1), operators_1.switchMap(function (currentUser) {
            if (!currentUser) {
                _this.router.events.subscribe(function (event) {
                    if (event instanceof router_1.NavigationCancel) {
                        if (!currentUser) {
                            _this.storageService.storeString('returnUrl', event.url);
                        }
                    }
                });
                return rxjs_1.of(false);
            }
            return rxjs_1.of(true);
        }), operators_1.tap(function (isAuth) {
            _this.checkToken();
            if (!isAuth) {
                _this.router.navigate(['/login']);
            }
        }));
    };
    AuthGuard.prototype.checkToken = function () {
        this.authService.client.subscribe(function (resp) {
            if (resp && resp.token) {
                var currentDate = new Date().getTime();
                var tokenDate = new Date(resp.exp).getTime();
                if (tokenDate > currentDate) {
                    return true;
                }
                else {
                    // this.authService.logout();
                    return false;
                }
            }
            else {
                // this.authService.logout();
                return false;
            }
        });
    };
    AuthGuard = __decorate([
        core_1.Injectable()
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
