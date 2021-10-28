import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserManagerService } from '../../../../data/services/administrator/user-manager.service';
import { ConfigService } from '../../../../data/services/config.service';
import { CurrencyService } from '../../../../data/services/currency.service';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../data/services/seo.service';
import { LocationsService } from 'src/app/data/localdata/locations.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  updateError: any;
  isLoading = false;
  isLoadMore = false;
  successPOP: string;
  errorPOP: string;
  currency: any;


  user: any;

  theUploaded: '';
  removeLabel = false;

  uploadingProgress = 0;
  fileUploadError: any;
  isUpdatingProfile = false;
  

  profileForm = new FormGroup({
    userID: new FormControl('', []),
    first_name: new FormControl('', []),
    last_name: new FormControl('', []),
    email: new FormControl('', []),
    username: new FormControl('', []),
    phone: new FormControl('', []),
    address: new FormControl('', []),
    state: new FormControl('', []),
    country: new FormControl('', []),
    photo: new FormControl('', []),
  });


  constructor(
    private route: ActivatedRoute,
    private userManagerService: UserManagerService,
    private configService: ConfigService,
    private routingService: RoutingService,
    private seoService: SEOService,
    private fileUploadService: FileUploadService,
    private generalSettingsService: GeneralSettingsService,
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  ngOnInit() {
    this.getCurrency();
    const userID = this.route.snapshot.paramMap.get('id');

    this.getCustomer(userID);
    this.seoUpdate();
  }

  private getCustomer(userID) {
    this.userManagerService.getCustomer(userID).subscribe(res => {
      if (res) {
        this.user = res.data.userInfo;
        this.theUploaded = this.user.photo;
        console.log(this.user);
        this.userFormDetail(res.data.userInfo);
      } else {
        this.routingService.replace([
          '/' + this.adminUrl + '/user-manager'
        ]);
      }
    });
  }


  userFormDetail(res){
    this.profileForm.get('first_name').setValue(res.first_name);
    this.profileForm.get('last_name').setValue(res.last_name);
    this.profileForm.get('email').setValue(res.email);
    this.profileForm.get('username').setValue(res.username);
    this.profileForm.get('phone').setValue(res.phone);
    this.profileForm.get('address').setValue(res.address);
    this.profileForm.get('state').setValue(res.state);
    this.profileForm.get('country').setValue(res.country);
    this.profileForm.get('photo').setValue(res.photo);
    this.profileForm.get('userID').setValue(res.id);
  }


  submitProfile(){
    this.isUpdatingProfile = true;
    const data = JSON.stringify(this.profileForm.value);
    this.userManagerService.updateUser(data).subscribe(res => {
      if(res && res.data){
        alert('User profile successfully updated');
        this.ngOnInit();
      }
      this.isUpdatingProfile = false;
    });
  }
  


  private getCurrency() {
    this.generalSettingsService.getGenSettings().subscribe(res => {
      this.currency = res.data.currency;
    });
  }
  


  clearnUrl(name) {
    return this.configService.clearnUrl(name);
  }
  

  private seoUpdate() {
    this.seoService.updateTitle('User Details');
    this.seoService.updateDescription('User Details');
  }

  
  theActiveTabl = 'profile';
  activeStatus = 'profile';
  openClikedTab(action){
    this.theActiveTabl = action;
    this.activeStatus = action;
  }




  // file upload
  onSelectedFile(event) {
    this.fileUploadError = null;
    const selectedFile = <File>event.target.files[0];

    if (this.validateFile(selectedFile) === 'upload') {
      this.uploadingProgress = 1;
      this.fileUploadError = null;
      const fd = new FormData;
      fd.append('file', selectedFile, selectedFile.name);

      this.fileUploadService.upload(
        fd, 'administrators', this.getFileName(selectedFile)
      ).subscribe(fielEvent => {
        if (fielEvent.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(fielEvent.loaded / fielEvent.total * 100 );
        } else if (fielEvent.type === HttpEventType.Response) {
          if (fielEvent.body.data) {
            this.profileForm.get('photo').setValue(fielEvent.body.data);
            this.theUploaded = fielEvent.body.data;
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
        ext.toLowerCase() !== 'jpg' ) {
      this.fileUploadError = 'Selected file format is not supported';
      this.removeUploadImg();
      return this.fileUploadError;
    } else if (size > maxSize) {
      this.fileUploadError = 'Selected file Size exceeded the maximum required size of ' + maxSize;
      return this.fileUploadError;
    } else {
      return 'upload';
    }
  }

  private getFileName(selectedFile) {
    return this.user?.username;
  }

}
