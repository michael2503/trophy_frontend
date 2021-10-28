import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { ConfigService } from '../../../../data/services/config.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TestimonialManagerService } from '../../../../data/services/administrator/testimonial-manager.service';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { FileUploadService } from '../../../../data/services/file-upload.service';
import { SEOService } from '../../../../data/services/seo.service';

@Component({
  selector: 'app-edit-testimony',
  templateUrl: './edit-testimony.component.html',
  styleUrls: ['./edit-testimony.component.scss']
})
export class EditTestimonyComponent implements OnInit {
  status: any;

  uploadErr: string;
  uploadRole: string;
  isBusy = false;
  uploadProgress = 0;


  testimonialData: any;
  form: any;
  isLoading = false;

  editTestForm = new FormGroup ({
    id: new FormControl('', []),
    testimony: new FormControl('', []),
    status: new FormControl('', []),
  });

  constructor(
    private route: ActivatedRoute,
    private testimonialManagerService: TestimonialManagerService,
    private configService: ConfigService,
    private routingService: RoutingService,
    private fileUploadService: FileUploadService,
    private seoService: SEOService

  ) { }

  ngOnInit() {
    this.getTestData();
    this.seoUpdate()
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private getTestData() {
    const testID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.testimonialManagerService.single(testID).subscribe(res => {
      if(res.data){
        this.testimonialData = res.data;
        this.retrieveData(res.data);
        this.isLoading = false;
      }
    });
  }

  private retrieveData(testimonialData: any) {
    this.editTestForm.get('id').setValue(testimonialData.id);
    this.editTestForm.get('testimony').setValue(testimonialData.testimony);
    this.editTestForm.get('status').setValue(testimonialData.status);
  }


  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.editTestForm.value);
    this.testimonialManagerService.updateTestimonial(data).subscribe(res => {
      if (res.data) {
        this.getTestData();
        alert('Your Request has been updated successfully!');
      } else {
        alert('Oops! we could not update your request.');
      }
      this.isLoading = false;
    });
  }


  private seoUpdate() {
    this.seoService.updateTitle('Edit Testimony');
    this.seoService.updateDescription('Edit Testimony');
  }
}
