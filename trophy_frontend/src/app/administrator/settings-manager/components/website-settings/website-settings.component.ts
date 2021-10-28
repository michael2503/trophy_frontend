import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { SEOService } from '../../../../data/services/seo.service';
import { FileUploadService } from '../../../../data/services/file-upload.service';
import { ConfigService } from '../../../../data/services/config.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ConfigurationManagerService } from 'src/app/data/services/administrator/configuration-manager.service';

@Component({
  selector: 'app-website-settings',
  templateUrl: './website-settings.component.html',
  styleUrls: ['./website-settings.component.scss']
})
export class WebsiteSettingsComponent implements OnInit {
  generalSetting: any;
  isLoading = false;

  selectedFile: File = null;
  selectedFileName: string;
  uploadedFile: string;
  uploadingProgress = 0;
  logoUploadingProgress = 0;

  faviUploadError: string;
  logoUploadError: string;

  form = new FormGroup({
    id: new FormControl('', []),
    biz_name: new FormControl('', []),
    site_name: new FormControl('', []),
    site_title: new FormControl('', []),
    site_email: new FormControl('', []),
    site_description: new FormControl('', []),
    site_url: new FormControl('', []),
    favicon_url: new FormControl('', []),
    logo_url: new FormControl('', []),
    biz_addr: new FormControl('', []),
    biz_city: new FormControl('', []),
    biz_state: new FormControl('', []),
    biz_country: new FormControl('', []),
    biz_phone: new FormControl('', []),
    chat_code: new FormControl('', []),
    copyright: new FormControl('', []),
    designed_by: new FormControl('', []),
  });

  constructor(
    private generalSettingsService: GeneralSettingsService,
    private seoService: SEOService,
    private fileUploadService: FileUploadService,
    private configService: ConfigService,
    private routingService: RoutingService,
    private adminAuthService: AdminAuthService,
    private configurationManagerService: ConfigurationManagerService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();
    this.getData();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }
  
  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        const data = this.configService.isRootAdmin(res);
        if (!data) {
          this.routingService.replace(['/' + this.adminUrl + '/dashboard']);
        }
      }
    });
  }


  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.form.value);
    this.configurationManagerService.updateSettings(data).subscribe(res => {
      if (res && res.data) {
        this.ngOnInit()
        alert('Updated successfully!');
      } else {
        alert('Oops! We could not update your request.');
      }
      this.isLoading = false;
    });
  }

  private getData() {
    this.generalSettingsService.getGenSettings().subscribe(res => {
      this.generalSetting = res.data.websiteSettings;
      this.theUploadedFav = this.generalSetting.favicon_url;
      this.theUploadedLogo = this.generalSetting.logo_url;
      this.retrieveData(res.data.websiteSettings);
    });
  }

  private retrieveData(res) {
    this.form.get('id').setValue(res.id);
    this.form.get('biz_name').setValue(res.biz_name);
    this.form.get('site_name').setValue(res.site_name);
    this.form.get('site_title').setValue(res.site_title);
    this.form.get('site_email').setValue(res.site_email);
    this.form.get('site_description').setValue(res.site_description);
    this.form.get('site_url').setValue(res.site_url);
    this.form.get('favicon_url').setValue(res.favicon_url);
    this.form.get('logo_url').setValue(res.logo_url);
    this.form.get('biz_addr').setValue(res.biz_addr);
    this.form.get('biz_city').setValue(res.biz_city);
    this.form.get('biz_state').setValue(res.biz_state);
    this.form.get('biz_country').setValue(res.biz_country);
    this.form.get('biz_phone').setValue(res.biz_phone);
  }

  private seoUpdate() {
    this.seoService.updateTitle('General Settings');
    this.seoService.updateDescription('General Settings');
  }

  faviconUpload(eventAlt) {
    this.uploadingProgress = 1;
    this.logoUploadingProgress = 0;
    const selectedFile = <File>eventAlt.target.files[0];
    
    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL( selectedFile );
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      this.uploadFile(selectedFile, 'favicon', 1, 1, 200, 200);
    };
  }

  logoUpload(eventAlt) {
    this.logoUploadingProgress = 1;
    this.uploadingProgress = 0;
    const selectedFile = <File>eventAlt.target.files[0];
    //
    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL( selectedFile );
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      this.uploadFile(selectedFile, 'logo', 1, 1, 1000, 1000);
    };
  }

  theUploadedFav: '';
  removeLabelFav = false;
  theUploadedLogo: '';
  removeLabelLogo = false;

  removeUploadFav(){
    this.theUploadedFav = '';
    this.removeLabelFav = true;
  }
  removeUploadLogo(){
    this.theUploadedLogo = '';
    this.removeLabelLogo = true;
  }

  private uploadFile(selectedFile, name, width, height, mxWidth, mxHeight) {
    const fd = new FormData;
    fd.append('file', selectedFile, selectedFile.name);
    this.fileUploadService.upload(
      fd, 'assets', name
    )
    .subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(event.loaded / event.total * 100 );
        } else if (event.type === HttpEventType.Response) {
          if (event.body.data) {
            if (name === 'favicon') {
              this.form.get('favicon_url').setValue(event.body.data);
              this.theUploadedFav = event.body.data;
              this.removeLabelFav = false;
            } else if(name === 'logo') {
              this.form.get('logo_url').setValue(event.body.data);
              this.theUploadedLogo = event.body.data;
              this.removeLabelLogo = false;
            }
          }
          this.uploadingProgress = 0;
          this.logoUploadingProgress = 0;
        }
      },
      err => {
        console.log(err);
      }
    );
  }


}
