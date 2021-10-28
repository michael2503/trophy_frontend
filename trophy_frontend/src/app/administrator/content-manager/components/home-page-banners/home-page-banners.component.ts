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
  selector: 'app-home-page-banners',
  templateUrl: './home-page-banners.component.html',
  styleUrls: ['./home-page-banners.component.scss']
})
export class HomePageBannersComponent implements OnInit {

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
  sliders: any;
  banners: any;
  isAddingSlide = false;
  isUpdaing = false;
  isBusy = false;
  uploadProgress = 0;
  uploadErr: string;
  uploadRole: string;

  mainSlider = new FormGroup({
    title: new FormControl('', []),
    id: new FormControl('', []),
    image: new FormControl('', [
      Validators.required
    ]),
    contents: new FormControl('', []),
  });

  form = new FormGroup({
    id: new FormControl('', []),
    title: new FormControl('', [
      Validators.required
    ]),
    sub_title: new FormControl('', []),
    mission: new FormControl('', []),
    vision: new FormControl('', []),
    content: new FormControl('', []),
    banner: new FormControl('', []),
  });




  // WYSIWYG
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: 'auto',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'},
        {class: 'algerian', name: 'Algerian'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  ngOnInit() {
    this.getSlides();
    this.seoUpdate();
  }

  private getSlides() {
    this.contentManagerService.slidersByAdmin().subscribe(res => {
      if (res.data) {
        this.sliders = res.data.slider;
        this.banners = res.data.aboutUs;
        this.theUploadedAbout = this.banners.banner;
        this.theUploadedSlide = this.sliders.image;
      }
      this.setBannerValue(res.data.aboutUs);
      this.setSliderValue(res.data.slider);
    });
  }

  private setBannerValue(banner) {
    if (banner) {
      this.form.get('id').setValue(banner.id);
      this.form.get('title').setValue(banner.title);
      this.form.get('sub_title').setValue(banner.sub_title);
      this.form.get('mission').setValue(banner.mission);
      this.form.get('vision').setValue(banner.vision);
      this.form.get('content').setValue(banner.content);
      this.form.get('banner').setValue(banner.banner);
    }
  }
  
  private setSliderValue(slide) {
    if (slide) {
      this.mainSlider.get('id').setValue(slide.id);
      this.mainSlider.get('title').setValue(slide.title);
      this.mainSlider.get('contents').setValue(slide.contents);
      this.mainSlider.get('image').setValue(slide.image);
    }
  }

  submitMainSlider() {
    this.isAddingSlide = true;
    const data = JSON.stringify(this.mainSlider.value);
    this.contentManagerService.updateSlider(data).subscribe(res => {
      if (res.data) {
        this.mainSlider.reset();
        this.getSlides();
        alert('Home banner successfully updated.');
      } else {
        alert('Oops! An error occured, we could not process your request.');
      }
      this.isAddingSlide = false;
    });
  }

  submit() {
    this.isUpdaing = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.updateAboutUs(data).subscribe(res => {
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

  addLeftBanner(event, role) {
    this.uploadErr = null;
    this.uploadRole = role;
    const width = 543;
    const height = 655;
    const mxW = 600;
    const mxH = 723;

    const selectedFile = <File>event.target.files[0];
    this.uploadHandler(selectedFile, role, width, height, mxW, mxH);
  }

  private uploadHandler(selectedFile, role, width, height, mxW, mxH) {
    this.removeLabelSlide = false;
    this.isBusy = true;
    if (this.validateFile(selectedFile) === 'upload') {
      this.uploadProgress = 1;
      const fd = new FormData;
      fd.append('file', selectedFile, selectedFile.name);

      this.fileUploadService.upload(
        fd, 'home-banners', this.getFileName(selectedFile),
      ).subscribe(fielEvent => {
        if (fielEvent.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(fielEvent.loaded / fielEvent.total * 100 );
        } else if (fielEvent.type === HttpEventType.Response) {
          if (fielEvent.body.data) {
            if (role === 'image') {
              console.log(fielEvent.body.data);
              this.mainSlider.get('image').setValue(fielEvent.body.data);
              this.theUploadedSlide = fielEvent.body.data;
              this.removeLabelSlide = false;
            } else {
              this.form.get('banner').setValue(fielEvent.body.data);
              console.log(fielEvent.body.data);
              this.theUploadedAbout = fielEvent.body.data;
              this.removeLabelAbout = false;
            }
          } else if (fielEvent.body.status === 'failed') {
            this.removeLabelSlide = true;
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

  theUploadedSlide= '';
  removeLabelSlide = true;
  
  theUploadedAbout = '';
  removeLabelAbout = false;

  removeUploadSlide(){
    this.theUploadedSlide = '';
    this.removeLabelSlide = true;
  }

  removeUploadAbout(){
    this.theUploadedAbout = '';
    this.removeLabelAbout = true;
  }

  removeBanner(role) {
    this.banners[role] = null;
    this.form.get(role).setValue('');
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


  private seoUpdate() {
    this.seoService.updateTitle('Home Page Banners');
    this.seoService.updateDescription('Home Page Banners');
  }

}
