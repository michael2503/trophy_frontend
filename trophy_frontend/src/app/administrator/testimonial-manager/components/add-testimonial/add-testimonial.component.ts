import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FileUploadService } from '../../../../data/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { ConfigService } from '../../../../data/services/config.service';
import { UserManagerService } from '../../../../data/services/administrator/user-manager.service';
import { TestimonialManagerService } from '../../../../data/services/administrator/testimonial-manager.service';
import { SEOService } from '../../../../data/services/seo.service';


@Component({
  selector: 'app-add-testimonial',
  templateUrl: './add-testimonial.component.html',
  styleUrls: ['./add-testimonial.component.scss']
})
export class AddTestimonialComponent implements OnInit {

  // uploadErr: string;
  // uploadRole: string;
  // isBusy = false;
  // uploadProgress = 0;
  // isLoading: any;

  // customerStatus: any;
  // pageLimit: any;
  // customers: any;
  // currPage: any;
  // customerCounts: any;

  // form = new FormGroup({
  //   loginID: new FormControl('', [
  //     Validators.required
  //   ]),
  //   testimony: new FormControl('', [
  //     Validators.required
  //   ]),
  // });


  constructor(
    // private testimonialService: TestimonialService,
    // private fileUploadService: FileUploadService,
    // private routingService: RoutingService,
    // private configService: ConfigService,
    // private userManagerService: UserManagerService,
    // private testimonialManagerService: TestimonialManagerService,
    // private seoService: SEOService
  ) { }

  ngOnInit() {
    // this.getCustomers();
    // this.seoUpdate()
  }

  // private getCustomers() {
  //   this.userManagerService.getCustomers(
  //     this.customerStatus, this.pageLimit, this.currPage
  //   ).subscribe(res => {
  //     if (res) {
  //       this.customers = res.data;
  //       this.customerCounts = res.counts;
  //     }
  //   });
  // }
  
  // get adminUrl() {
  //   return this.configService.adminURL;
  // }


  // get loginID() {
  //   return this.form.get('loginID');
  // }

  // get testimony() {
  //   return this.form.get('testimony');
  // }


  // submit() {
  //   this.isLoading = true;
  //   const data = JSON.stringify(this.form.value);
  //   this.testimonialManagerService.addTestimony(data).subscribe(res => {
  //     if (res) {
  //       alert('Testimonial Successfully Posted');
  //       this.form.reset();
  //     } else {
  //       alert('Oops! we could not update your request.');
  //     }
  //     this.isLoading = false;
  //   });
  // }

  // private seoUpdate() {
  //   this.seoService.updateTitle('Add Testimony');
  //   this.seoService.updateDescription('Add Testimony');
  // }

}
