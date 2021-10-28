import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/data/services/config.service';
import { HomeService } from 'src/app/data/services/guest/home.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutUs;
  whoWeAre;
  counter;
  clients;

  constructor(
    private homeService: HomeService,
    private config: ConfigService,
    private seoService: SEOService,
  ) { }

  ngOnInit(): void {
    this.seoUpdate();
    this.getData();
  }

  private seoUpdate() {
    this.seoService.updateTitle('About Us');
    this.seoService.updateDescription('About Us');
  }

  private getData() {
    this.homeService.homeData.subscribe(res => {
      if (res) {
        this.aboutUs = res.data.aboutUs;
        this.whoWeAre = res.data.whoWeAre;
      } else {
        this.homeService.getHomeData().subscribe();
      }
    });
  }

  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

}
