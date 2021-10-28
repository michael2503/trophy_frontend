import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../data/services/config.service';
import { SEOService } from '../../../../data/services/seo.service';
import { SupportManagerService } from 'src/app/data/services/administrator/support-manager.service';
import { RoutingService } from 'src/app/data/helpers/routing.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  pageLimit = 50;
  currentPage = 1;
  supports = [];
  allUsers = [];
  isLoading = true;
  supportsCounty = 0;
  isLoadMore = false;

  isAdding = false;

  status = 'all';

  uploadingProgress = 0;
  fileUploadError: any;
  theUploaded= '';
  removeLabel = true;

  form = new FormGroup({
    subject: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required),
    image: new FormControl(''),
    user_id: new FormControl(''),
  });

  closeModal = new BehaviorSubject(false);

  constructor(
    private configService: ConfigService,
    private supportManagerService: SupportManagerService,
    private seoService: SEOService,
    private route: RoutingService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit() {
    const status = this.route.activeRoute;
    if (status) {
      if(status == 'support-manager'){
        this.status = 'all';
      } else {
        this.status = status;
      }
    }

    this.getSupport();
    this.seoUpdate();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }



  private getSupport(isMore = false) {
    this.isLoading = true;
    this.supportManagerService.getAllSupport(
      this.status, this.pageLimit, this.currentPage
    ).subscribe(res => {
      console.log(res);
      if (res.data) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.supports.push(res.data.data[i]);
          }
        } else {
          this.supports = res.data.data;
          this.allUsers = res.data.users;
        }
        this.supportsCounty = res.data.counts;
      }
      this.isLoadMore = false;
      this.isLoading = false;
    });
  }



  loadMore() {
    this.isLoadMore = true;
    if (this.supportsCounty > this.supports.length) {
      this.currentPage++;
      this.getSupport(true);
    }
  }

  deleteSupport(newsID: number) {
    if (confirm('Are you sure you want to DELETE this support?') ) {
      this.supportManagerService.deleteSupport(newsID).subscribe(res => {
        if(res.data){
          this.getSupport();
        }
      });
    }
  }

  private seoUpdate() {
    this.seoService.updateTitle('All Support');
    this.seoService.updateDescription('All Support');
  }


  // file upload
  onSelectedFile(event) {
    this.removeLabel = false;
    this.fileUploadError = null;
    const selectedFile = <File>event.target.files[0];

    if (this.validateFile(selectedFile) === 'upload') {
      this.uploadingProgress = 1;
      this.fileUploadError = null;
      const fd = new FormData;
      fd.append('file', selectedFile, selectedFile.name);

      this.fileUploadService.upload(
        fd, 'support', this.getFileName(selectedFile)
      ).subscribe(fielEvent => {
        if (fielEvent.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(fielEvent.loaded / fielEvent.total * 100 );
        } else if (fielEvent.type === HttpEventType.Response) {
          if (fielEvent.body.data) {
            this.form.get('image').setValue(fielEvent.body.data);
            this.theUploaded = fielEvent.body.data;
            console.log(fielEvent.body.data);
            this.removeLabel = false;
          } else if (fielEvent.body.status === 'failed') {
            this.removeLabel = true;
            if (fielEvent.body.data) {
              this.fileUploadError = fielEvent.body.data;
            } else {
              this.fileUploadError = 'Oops! Something went wrong, we could not upload file';
            }
          }
          this.uploadingProgress = 0;
        }
      }, err => { console.log(err); }
      );
    }
  }

  removeUploadImg(){
    this.theUploaded = '';
    this.removeLabel = true;
  }

  private validateFile(selectedFile) {
    const name = selectedFile.name;
    const size = Number(selectedFile.size);
    const maxSize = 10000000;
    const ext = name.substring(name.lastIndexOf('.') + 1);

    if (ext.toLowerCase() !== 'png' &&
    ext.toLowerCase() !== 'jpeg' &&
    ext.toLowerCase() !== 'docx' &&
    ext.toLowerCase() !== 'pdf' &&
    ext.toLowerCase() !== 'mpg' &&
    ext.toLowerCase() !== 'mp4' &&
    ext.toLowerCase() !== 'mp3' &&
    ext.toLowerCase() !== 'jpg' ) {
      this.fileUploadError = 'Selected file format is not supported';
      return this.fileUploadError;
    } else if (size > maxSize) {
      this.fileUploadError = 'Selected file Size exceeded the maximum required size of ' + maxSize;
      return this.fileUploadError;
    } else {
      return 'upload';
    }
  }

  private getFileName(selectedFile) {
    return selectedFile.name.split('.')[0];
  }



  submit() {
    this.isAdding = true;
    const data = JSON.stringify(this.form.value);
    this.supportManagerService.composeSupport(data).subscribe(res => {
      console.log(res);
      if (res && res.data) {
        this.form.reset();
        this.theUploaded = '';
        this.removeLabel = true;
        this.closeModal.next(true);
        this.ngOnInit();
        alert('Service added successfully!');
      } else {
        alert('Oops, Error in adding Service!');
      }
      this.isAdding = false;
    });
  }

}
