import { Component, OnInit } from '@angular/core';
import { InvestmentService } from '../../../data/services/investor/investment.service';
import { SEOService } from 'src/app/data/services/seo.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SupportService } from 'src/app/data/services/investor/support.service';
import { RoutingService } from 'src/app/data/helpers/routing.service';
import { BehaviorSubject } from 'rxjs';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SuccessService } from 'src/app/data/services/success.service';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  pageLimit = 50;
  currentPage = 1;
  isLoading = false;
  isLoadMore = false;
  status = 'all';
  supportCounty: any;
  support = [];
  loading = true;
  submitting = false;
  auth: any;
  
  closeModal = new BehaviorSubject(false);

  form = new FormGroup({
    subject: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required),
    image: new FormControl(''),
    user_id: new FormControl(''),
  });
  

  constructor(
    private supportService: SupportService,
    private seoService: SEOService,
    private generalSettings: GeneralSettingsService,
    private route: RoutingService,
    private fileUploadService: FileUploadService,
    private successService: SuccessService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const status = this.route.activeRoute;
    if (status) {
      if(status == 'support'){
        this.status = 'all';
      } else {
        this.status = status;
      }
    }

    this.seoUpdate();
    this.bringSupport();
    this.getAuth();
  }

  private getAuth() {
    this.authService.investor.subscribe(auth => {
      this.auth = auth;
      this.form.get('user_id').setValue(this.auth.id);
    });
  }


  private bringSupport(isMore = false) {
    this.isLoading = true;
    this.supportService.getSupports(
      this.status, this.pageLimit, this.currentPage
    ).subscribe(res => {
      if (res.data) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.support.push(res.data.data[i]);
          }
        } else {
          this.support = res.data.data;
        }
        this.supportCounty = res.data.counts;
      }
      this.isLoadMore = false;
      this.isLoading = false;
      this.loading = false;
    });
  }


  loadMore() {
    this.isLoadMore = true;
    if (this.supportCounty > this.support.length) {
      this.currentPage++;
      this.bringSupport(true);
    }
  }


  private seoUpdate() {
    this.seoService.updateTitle('Support');
    this.seoService.updateDescription('Support');
  }


  uploadingProgress = 0;
  uploadFailed = false;
  popUrl;
  selectedFile

  selectFile(e) {
    if (this.uploadingProgress) return;
    this.uploadFailed = false;
    this.selectedFile = e.target.files[0];
    if (this.selectedFile) {
      this.popUrl = URL.createObjectURL(this.selectedFile);
      this.onSelectedFile();
    }
  }

  onSelectedFile() {
    const selectedFileName = this.selectedFile.name;
    const fd = new FormData;
    fd.append('file', this.selectedFile, selectedFileName);
    this.uploadingProgress = 1;
    this.fileUploadService.upload(
      fd, 'support', 'support'
    )
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(event.loaded / event.total * 100);
        } else if (event.type === HttpEventType.Response) {
          if (event.body.data) {
            this.form.get('image').setValue(event.body.data);
            this.popUrl = event.body.data;
          }
          this.uploadingProgress = 0;
        }
      }, err => {
        this.uploadFailed = true;
        this.popUrl = null;
        this.uploadingProgress = 0;
      });
  }


  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.supportService.composeSupport(data).subscribe(res => {
      if (res && res.data) {
        this.form.reset();
        this.popUrl = null;
        this.closeModal.next(true);
        this.ngOnInit();
        this.successService.msg.next({
          title: 'Support successfully send',
          body: ''
        })
      }
      this.submitting = false;
    }, err => {
      this.submitting = false;
    });
  }


}
