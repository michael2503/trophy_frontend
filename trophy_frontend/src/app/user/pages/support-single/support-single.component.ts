import { Component, OnInit } from '@angular/core';
import { InvestmentService } from '../../../data/services/investor/investment.service';
import { SEOService } from 'src/app/data/services/seo.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SupportService } from 'src/app/data/services/investor/support.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { SuccessService } from 'src/app/data/services/success.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-support-single',
  templateUrl: './support-single.component.html',
  styleUrls: ['./support-single.component.scss']
})
export class SupportSingleComponent implements OnInit {
  
  support: any;
  supportReply: any;
  loading = true;

  closeModal = new BehaviorSubject(false);

  submitting = false;

  uploadingProgress = 0;
  uploadFailed = false;
  popUrl;
  selectedFile

  form = new FormGroup({
    subject: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required),
    image: new FormControl(''),
    user_id: new FormControl(''),
    reply_id: new FormControl(''),
  });
  
  constructor(
    private supportService: SupportService,
    private seoService: SEOService,
    private generalSettings: GeneralSettingsService,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private successService: SuccessService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.getSupportInfo(param.id);
    });
  }


  private seoUpdate(t) {
    this.seoService.updateTitle(`${t} - News`);
    this.seoService.updateDescription(`${t} - News`);
  }

  private getSupportInfo(id) {
    console.log(id);
    this.supportService.supportSingle(id).subscribe(res => {
      console.log(res)
      if (res && res.data) {
        this.support = res.data.single;
        this.supportReply = res.data.reply;
        this.seoUpdate(this.support.subject);
        this.form.get('reply_id').setValue(this.support.id);
        this.form.get('user_id').setValue(this.support.user_id);
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }






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
