import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/data/helpers/storage.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { HomeService } from 'src/app/data/services/guest/home.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homeData;
  loading = true;

  constructor(
    private homeService: HomeService,
    private seoService: SEOService,
    private config: ConfigService,
    private generalSettings: GeneralSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    const referal = this.route.snapshot.paramMap.get('username');
    if (referal) {
      this.storageService.storeString('referral', referal);
      this.router.navigateByUrl('/register');
    }
    this.seoUpdate();
    this.getHomeData();
  }

  private seoUpdate() {
    this.seoService.updateTitle('Home');
    this.seoService.updateDescription('Home');
  }

  private getHomeData() {
    this.homeService.homeData.subscribe(res => {
      if (res) {
        this.homeData = res.data;
        this.loading = false;
      } else {
        this.homeService.getHomeData().subscribe(res => {
          this.loading = false;
        }, err => {
          this.loading = false;
        });
      }
    })
  }


  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

}
