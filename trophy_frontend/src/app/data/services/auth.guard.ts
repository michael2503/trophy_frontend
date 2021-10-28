import { CanLoad, NavigationCancel, NavigationEnd, Route, RouterEvent, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { RoutingService } from '../helpers/routing.service';
import { StorageService } from '../helpers/storage.service';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private routingService: RoutingService,
    private storageService: StorageService,
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve) => {
      this.authService.checking.subscribe(checking => {
        if (!checking) {
          this.authService.investor.subscribe(auth => {
            if (!auth) {
              this.router.events.subscribe(event => {
                if (event instanceof NavigationCancel) {
                  if (!auth) {
                    this.storageService.storeString('returnUrl', event.url);
                  }
                }
              });
              this.router.navigate(['/login']);
              resolve(false);
            } else {
              resolve(true);
            }
          });
        }
      });
    });
  }

  private checkToken() {
    this.authService.investor.subscribe(resp => {
      if (resp && resp.token) {
        const currentDate = new Date().getTime();
        const tokenDate = new Date(resp.exp).getTime();
        if (tokenDate > currentDate) {
          return true;
        } else {
          // this.authService.logout();
          return false;
        }
      } else {
        // this.authService.logout();
        return false;
      }
    });
  }

}
