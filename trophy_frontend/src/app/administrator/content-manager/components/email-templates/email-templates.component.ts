import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../../data/services/administrator/pages.service';
import { ConfigService } from '../../../../data/services/config.service';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { SEOService } from '../../../../data/services/seo.service';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager-service';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {
  templates: any;
  pageCounts = 0;

  constructor(
    private contentManagerService: ContentManagerService,
    private configService: ConfigService,
    private routingService: RoutingService,
    private seoService: SEOService
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  ngOnInit() {
    this.getTemplates();
    this.seoUpdate()
  }
  private getTemplates() {
    this.contentManagerService.getAll().subscribe(res => {
      if (res.data) {
        this.templates = res.data;
      }
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('Email Templates');
    this.seoService.updateDescription('Email Templates');
  }
}
