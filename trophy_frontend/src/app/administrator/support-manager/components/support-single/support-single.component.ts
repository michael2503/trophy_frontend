import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../data/services/config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../data/services/seo.service';
import { ActivatedRoute } from '@angular/router';
import { SupportManagerService } from 'src/app/data/services/administrator/support-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-support-single',
  templateUrl: './support-single.component.html',
  styleUrls: ['./support-single.component.scss']
})
export class SupportSingleComponent implements OnInit {

  isLoading = false;
  isAdding = false;
  support: any;
  supportReply = [];

  uploadingProgress = 0;
  fileUploadError: any;
  theUploaded= '';
  removeLabel = true;

  form = new FormGroup({
    subject: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required),
    image: new FormControl(''),
    user_id: new FormControl(''),
    reply_id: new FormControl(''),
  });

  closeModal = new BehaviorSubject(false);

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private route: ActivatedRoute,
    private supportManagerService: SupportManagerService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit() {
    this.seoUpdate()
    this.getSupportData()
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  
  private getSupportData() {
    const supID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.supportManagerService.single(supID).subscribe(res => {
      if(res.data){
        this.support = res.data.single;
        this.supportReply = res.data.reply;
        this.form.get('reply_id').setValue(this.support.id);
        this.form.get('user_id').setValue(this.support.user_id);
        this.isLoading = false;
      }
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('Support Details');
    this.seoService.updateDescription('Support Details');
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
