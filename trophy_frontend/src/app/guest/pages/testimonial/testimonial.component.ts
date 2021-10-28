import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ConfigService } from 'src/app/data/services/config.service';
import { SEOService } from 'src/app/data/services/seo.service';
import { TestimonyService } from 'src/app/data/services/testimony.service';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {
  testimonials = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private config: ConfigService,
    private testimonyService: TestimonyService,
    private seoService: SEOService,
  ) { }


  ngOnInit(): void {
    this.seoUpdate();
    this.getTestimonies();
  }

  private seoUpdate() {
    this.seoService.updateTitle('Testimonials');
    this.seoService.updateDescription('Testimonials');
  }

  private getTestimonies() {
    this.testimonyService.testimonies().subscribe(res => {
      this.testimonials = res.data;
    });
  }

  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

}
