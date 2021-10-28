import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  get adminURL() {
    return 'administrator';
  }

  get adminBackUrl() {
    return 'admin';
  }

  getProject_name() {
    return 'Oziconnect';
  }

  getBusiness_name() {
    return 'Oziconnect Global Network Ltd';
  }

  base_url() {
    return 'https://trophy.candslsyfconvention.org/backend/laravel/';
    return 'http://192.168.8.101:8800/';
  }

  treatImgUrl(imgurl) {
    if (imgurl) {
      let baseIp = this.base_url().split('//')[1].split('/')[0];
      let imgIp = imgurl.split('//')[1].split('/')[0];
      return imgIp == 'localhost' || imgIp.match(/\d+\.\d+\.\d+\.\d+:\d+/) ? imgurl.replace(imgIp, baseIp) : imgurl;
    }
    return null;
  }

  bankInfo() {
    return {
      name: 'Oziconnect Global Network Limited',
      ngn: 2032394126,
      usd: 2032394061,
      bank: 'First Bank Plc',
      swift: 'FBNINGLA',
      instructions: 'For payment confirmation, please send proof of payment to payment@oziconnect.com',
    };
  }

  clearnUrl(name) {
    const str = name.trim();
    if (str) {
      return str.replace(/[^a-zA-Z0-9 &+,._-]/g, '').split('&').join('and')
        .split(' + ').join('-').split('+ ').join('-').split('+').join('-')
        .split(', ').join('-').split(',').join('-')
        .split('  ').join('-').split(' - ').join('-').split(' ').join('-')
        .toLowerCase().replace(/^-/g, '');
    }
  }

  getTitleCase(str) {
    return str.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase(); });
  }

  getRandomString(lengthCnt) {
    let result = '', i;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (i = lengthCnt; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  isRootAdmin(admin) {
    if (admin && admin.username === 'administrator') {
      return true;
    } else {
      return false;
    }
  }

  get isDemo() {
    return false;
  }
}
