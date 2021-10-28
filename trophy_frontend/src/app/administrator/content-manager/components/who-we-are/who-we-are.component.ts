import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { FileUploadService } from '../../../../data/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SEOService } from '../../../../data/services/seo.service';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager-service';


@Component({
  selector: 'app-who-we-are',
  templateUrl: './who-we-are.component.html',
  styleUrls: ['./who-we-are.component.scss']
})
export class WhoWeAreComponent implements OnInit {

  get adminUrl() {
    return this.configService.adminURL;
  }

  constructor(
    private configService: ConfigService,
    private fileUploadService: FileUploadService,
    private contentManagerService: ContentManagerService,
    private routingService: RoutingService,
    private seoService: SEOService
  ) { }
  
  whoWe: any;
  callTo: any;
  
  isAddingSlide = false;
  isUpdaing = false;
  isBusy = false;
  uploadProgress = 0;
  uploadErr: string;
  uploadRole: string;

  whoWeAre = new FormGroup({
    sub_title: new FormControl('', []),
    id: new FormControl('', []),
    banner: new FormControl('', [
      Validators.required
    ]),
    content: new FormControl('', []),
  });

  callToAction = new FormGroup({
    id: new FormControl('', []),
    sub_title: new FormControl('', []),
    content: new FormControl('', []),
  });


  ngOnInit() {
    this.getSlides();
    this.seoUpdate();
  }

  private getSlides() {
    this.contentManagerService.whoWeCallTo().subscribe(res => {
      if (res.data) {
        this.whoWe = res.data.whoWeAre;
        this.callTo = res.data.callToAction;
      }
      this.setWeAreValue(res.data.whoWeAre);
      this.setActionValue(res.data.callToAction);
    });
  }

  private setWeAreValue(res) {
    if (res) {
      this.whoWeAre.get('id').setValue(res.id);
      this.whoWeAre.get('sub_title').setValue(res.sub_title);
      this.whoWeAre.get('content').setValue(res.content);
      this.whoWeAre.get('banner').setValue(res.banner);
    }
  }
  
  private setActionValue(res) {
    if (res) {
      this.callToAction.get('id').setValue(res.id);
      this.callToAction.get('sub_title').setValue(res.sub_title);
      this.callToAction.get('content').setValue(res.content);
    }
  }

  submitWhoWeArer() {
    this.isAddingSlide = true;
    const data = JSON.stringify(this.whoWeAre.value);
    this.contentManagerService.updateWhoWeAre(data).subscribe(res => {
      if (res.data) {
        this.getSlides();
        alert('Update is successful.');
      } else {
        alert('Oops! An error occured, we could not process your request.');
      }
      this.isAddingSlide = false;
    });
  }

  submitCallToAction() {
    this.isUpdaing = true;
    const data = JSON.stringify(this.callToAction.value);
    this.contentManagerService.updateCallToAction(data).subscribe(res => {
      if (res.data) {
        this.getSlides();
        alert('Update is successful');
      } else {
        alert('Oops! Something went wrong.');
      }
      this.isUpdaing = false;
    });
  }

  addSlide(event, role) {
    this.uploadErr = null;
    this.uploadRole = role;
    const width = 500;
    const height = 500;
    const mxW = 5000;
    const mxH = 5000;

    const selectedFile = <File>event.target.files[0];
    this.uploadHandler(selectedFile, role, width, height, mxW, mxH);
  }

  // addLeftBanner(event, role) {
  //   this.uploadErr = null;
  //   this.uploadRole = role;
  //   const width = 543;
  //   const height = 655;
  //   const mxW = 600;
  //   const mxH = 723;

  //   const selectedFile = <File>event.target.files[0];
  //   this.uploadHandler(selectedFile, role, width, height, mxW, mxH);
  // }

  private uploadHandler(selectedFile, role, width, height, mxW, mxH) {
    this.isBusy = true;
    if (this.validateFile(selectedFile) === 'upload') {
      this.uploadProgress = 1;
      const fd = new FormData;
      fd.append('file', selectedFile, selectedFile.name);

      this.fileUploadService.upload(
        fd, 'whoWeAre', this.getFileName(selectedFile),
      ).subscribe(fielEvent => {
        if (fielEvent.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(fielEvent.loaded / fielEvent.total * 100 );
        } else if (fielEvent.type === HttpEventType.Response) {
          if (fielEvent.body.data) {
            if (role === 'image') {
              this.whoWeAre.get('banner').setValue(fielEvent.body.data);
            }
          } else if (fielEvent.body.status === 'failed') {
            this.uploadErr = fielEvent.body.data;
          } else {
            this.uploadErr = 'Oops! Something went wrong, we could not process upload.';
          }
          this.isBusy = false;
          this.uploadProgress = 0;
        }
      }, err => { console.log(err); }
      );
    } else {
      this.uploadErr = this.validateFile(selectedFile);
    }
  }

  private validateFile(selectedFile) {
    const name = selectedFile.name;
    const size = Number(selectedFile.size);
    const maxSize = 10000000;
    const ext = name.substring(name.lastIndexOf('.') + 1);

    if (ext.toLowerCase() !== 'png' &&
        ext.toLowerCase() !== 'gif' &&
        ext.toLowerCase() !== 'jpeg' &&
        ext.toLowerCase() !== 'jpg' ) {
      return 'Selected file format is not supported';
    } else if (size > maxSize) {
      return 'Selected file Size exceeded the maximum required size of ' + maxSize;
    } else {
      return 'upload';
    }
  }

  private getFileName(selectedFile) {
    return selectedFile.name.split('.')[0];
  }

  delete(id) {
    const x = 'Are you sure you want to DELETE this slide?';
    if (confirm(x)) {
      this.contentManagerService.delete(id).subscribe(res => {
        if (res) {
          this.getSlides();
        } else {
          alert('Oops! Something went wrong, we could not process your request.');
        }
      });
    }
  }

  edit(id) {
    this.routingService.replace([
      this.adminUrl + '/content-manager/home-banners/' + id
    ]);
  }

  // removeBanner(role) {
  //   this.banners[role] = null;
  //   this.form.get(role).setValue('');
  // }

  private seoUpdate() {
    this.seoService.updateTitle('Home Page Banners');
    this.seoService.updateDescription('Home Page Banners');
  }

}
