import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService } from 'src/app/data/helpers/routing.service';
import { StaticContentService } from 'src/app/data/services/guest/static-content.service';

@Component({
  selector: 'app-dynamic-static',
  templateUrl: './dynamic-static.component.html',
  styleUrls: ['./dynamic-static.component.scss']
})
export class DynamicStaticComponent implements OnInit {
  pageContents;
  isLoading = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private routingService: RoutingService,
    private staticContentService: StaticContentService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.scrollTop = 0;
      }
      this.getContent(param.url);
    });
  }

  private async getContent(page) {
    this.isLoading = true;
    (await this.staticContentService.retrieveContent(page)).subscribe(res => {
      if (res) {
        this.pageContents = res.data;
      }
      this.isLoading = false;
    });
  }

}
