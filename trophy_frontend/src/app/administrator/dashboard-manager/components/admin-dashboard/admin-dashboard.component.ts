import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../data/services/config.service';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';

import { DashboardService } from 'src/app/data/services/administrator/dashboard.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  adm: any;
  isLoading = false;
  isRootAdmin = false;

  activeUser = 14;
  susUser;
  allUser;
  blockSuspUsers;
  recentSignUp;
  recentUser;
  currency;
  vendorInfo;
  clientInfo;
  unreadSupport;

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private adminAuthService: AdminAuthService,
    private dashboardService: DashboardService,
    private generalSettingsService: GeneralSettingsService,
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();
    this.getCustomers();
    this.dashInfo();
    this.getCurrency();
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
        const data = this.configService.isRootAdmin(res);
        if (data) {
          this.isRootAdmin = true;
        }
      }
    });
  }


  clearnUrl(name) {
    return this.configService.clearnUrl(name);
  }

  private seoUpdate() {
    this.seoService.updateTitle('Admin Dasboard');
    this.seoService.updateDescription('Admin Dasboard');
  }


  private getCustomers() {
    // this.userManagerService.dashboardInfo()
    // .subscribe(res => {
    //   if (res) {
        
    //   }
    // });
  }

  private getCurrency() {
    this.generalSettingsService.getGenSettings().subscribe(res => {
      this.currency = res.data.currency;
    });
  }

  private dashInfo() {
    this.dashboardService.getInfo()
    .subscribe(res => {
      if (res) {
        this.allUser = res.data.allUser;
        this.activeUser = res.data.activeUser;
        this.blockSuspUsers = res.data.blockSuspUsers;
        this.susUser = res.data.susUser;

        this.recentSignUp = res.data.recentSignUp;
        this.recentUser = res.data.recentUser;
        
        this.clientInfo = res.data.clientInfo;
        this.vendorInfo = res.data.vendorInfo;
        
        this.unreadSupport = res.data.unreadSupport;
      }
    });
  }

}
