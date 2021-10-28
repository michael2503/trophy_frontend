import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminAuthService } from './data/services/admin-auth.service';
import { AuthService } from './data/services/auth.service';
import { GeneralSettingsService } from './data/services/general-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sport';
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private generalSettingsService: GeneralSettingsService,
    private adminAuthService: AdminAuthService
  ) { }

  ngOnInit() {
    this.autoLogin();
    this.adminAutoLogin();
    this.getGenSettings();
  }

  private getGenSettings() {
    this.generalSettingsService.getGenSettings().subscribe();
  }

  private adminAutoLogin() {
    this.adminAuthService.autoLogin();
  }

  private autoLogin() {
    this.authService.autoLogin();
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.scrollTop = 0;
    }
  }
}
