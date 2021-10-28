import { Component, OnInit } from '@angular/core';
import { BankService } from 'src/app/data/localdata/banks.service';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { DashboardService } from 'src/app/data/services/investor/dashboard.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  unreadSupports;
  auth;
  theInt;
  copied = false;
  curr = '&#8358;';
  loading = true;
  siteUrl;

  unreadSupportsCount;

  bankInfo = [];

  transactions = []

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private config: ConfigService,
    private seoService: SEOService,
    private generalSettings: GeneralSettingsService,
  ) { }

  ngOnInit(): void {
    this.seoUpdate();
    this.getAuth();
    this.getInfo();
  }

  private seoUpdate() {
    this.seoService.updateTitle('Dashboard');
    this.seoService.updateDescription('Dashboard');
  }

  private getAuth() {
    this.authService.investor.subscribe(auth => {
      this.auth = auth;
      if(this.auth?.interest){
        this.theInt = JSON.parse(this.auth?.interest);
      }
    });
  }

  private getInfo() {
    this.dashboardService.getInfo().subscribe(res => {
      if (res && res.data) {
        this.unreadSupports = res.data.unreadSupport;
        this.unreadSupportsCount = res.data.unreadSupport.lenght;
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

}
