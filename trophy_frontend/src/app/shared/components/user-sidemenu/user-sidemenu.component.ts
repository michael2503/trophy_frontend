import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-user-sidemenu',
  templateUrl: './user-sidemenu.component.html',
  styleUrls: ['./user-sidemenu.component.scss']
})
export class UserSidemenuComponent implements OnInit {
  logoUrl;
  constructor(
    private authService: AuthService,
    private router: Router,
    private generalSettings: GeneralSettingsService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.checkAuth();
    this.getLogo();
  }

  private checkAuth() {
    this.authService.investor.subscribe(auth => {
      if (auth) {
        if (!+auth.email_verify) {
          this.router.navigateByUrl('/investor/email-verification');
        }
      }
    });
  }

  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

  private getLogo() {
    this.generalSettings.genSettings.subscribe(res => {
      if (res) {
        this.logoUrl = res.websiteSettings.logo_url;
      }
    });
  }

  logout() {
    this.authService.logoutAlt();
  }

  closeMenu(menu) {
    menu.classList.remove('showMenu');
  }

}
