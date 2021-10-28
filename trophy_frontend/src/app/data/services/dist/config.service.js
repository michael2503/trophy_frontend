"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ConfigService = void 0;
var core_1 = require("@angular/core");
var ConfigService = /** @class */ (function () {
    function ConfigService() {
    }
    Object.defineProperty(ConfigService.prototype, "adminURL", {
        get: function () {
            return 'administrator';
        },
        enumerable: false,
        configurable: true
    });
    ConfigService.prototype.getProject_name = function () {
        return 'Oziconnect';
    };
    ConfigService.prototype.getBusiness_name = function () {
        return 'Oziconnect Global Network Ltd';
    };
    ConfigService.prototype.base_url = function () {
        // return 'https://api.oziconnect.com/development/';
        return 'http://192.168.8.107:4400/';
        // return 'https://localhost/oziconnectService/';
        // return 'https://api.oziconnect.com/';
        return 'https://192.168.8.103/oziconnectService/';
        // return 'https://192.168.43.125/oziconnectService/';
    };
    ConfigService.prototype.treatImgUrl = function (imgurl) {
        if (imgurl) {
            var baseIp = this.base_url().split('//')[1].split('/')[0];
            var imgIp = imgurl.split('//')[1].split('/')[0];
            return imgIp == 'localhost' || imgIp.match(/\d+\.\d+\.\d+\.\d+/) ? imgurl.replace(imgIp, baseIp) : imgurl;
        }
        return null;
    };
    ConfigService.prototype.bankInfo = function () {
        return {
            name: 'Oziconnect Global Network Limited',
            ngn: 2032394126,
            usd: 2032394061,
            bank: 'First Bank Plc',
            swift: 'FBNINGLA',
            instructions: 'For payment confirmation, please send proof of payment to payment@oziconnect.com'
        };
    };
    ConfigService.prototype.clearnUrl = function (name) {
        var str = name.trim();
        if (str) {
            return str.replace(/[^a-zA-Z0-9 &+,._-]/g, '').split('&').join('and')
                .split(' + ').join('-').split('+ ').join('-').split('+').join('-')
                .split(', ').join('-').split(',').join('-')
                .split('  ').join('-').split(' - ').join('-').split(' ').join('-')
                .toLowerCase().replace(/^-/g, '');
        }
    };
    ConfigService.prototype.getTitleCase = function (str) {
        return str.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase(); });
    };
    ConfigService.prototype.getRandomString = function (lengthCnt) {
        var result = '', i;
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (i = lengthCnt; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    };
    ConfigService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], ConfigService);
    return ConfigService;
}());
exports.ConfigService = ConfigService;
