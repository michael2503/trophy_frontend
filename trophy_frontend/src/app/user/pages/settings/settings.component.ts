import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BankInfoService } from 'src/app/data/services/investor/bank-info.service';
import { BankService } from 'src/app/data/localdata/banks.service';
import { AuthService } from 'src/app/data/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from 'src/app/data/services/seo.service';
import { title } from 'process';
import { SuccessService } from 'src/app/data/services/success.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { HttpEventType } from '@angular/common/http';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  submitting = false;
  pageTitle;
  loading = false;
  activePage = 'profile-settings';
  auth;
  photoUrl;

  uploadingProgress = { owner: 'none', count: 0 };
  photoErr;
  emailErr;
  usernameErr;

  passForm = new FormGroup({
    old_password: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });

  @ViewChild('currPassGroup') currPassGroup: ElementRef;
  passErr;

  profileForm = new FormGroup({
    id: new FormControl(''),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    username: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    photo: new FormControl(''),
  });
  @ViewChild('usernameGroup') usernameGroup: ElementRef;
  @ViewChild('phoneGroup') phoneGroup: ElementRef;
  @ViewChild('emailGroup') emailGroup: ElementRef;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private seoService: SEOService,
    private successService: SuccessService,
    private configService: ConfigService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.activePage = param.url;
      this.seoUpdate(param.url);
    });
    for (let key in this.passForm.value) {
      Object.defineProperty(this, key, { get: () => this.passForm.get(key) });
    }
    // for (let key in this.bankForm.value) {
    //   Object.defineProperty(this, key, { get: () => this.bankForm.get(key) });
    // }
    this.getAuth();
  }

  private getAuth() {
    this.authService.investor.subscribe(auth => {
      this.auth = auth;
      if (auth) {
        this.updateFormFields(this.auth);
        this.photoUrl = this.auth.photo;
      }
    });
  }

  private updateFormFields(auth) {
    this.profileForm.get('first_name').setValue(auth.first_name);
    this.profileForm.get('last_name').setValue(auth.last_name);
    this.profileForm.get('email').setValue(auth.email);
    this.profileForm.get('username').setValue(auth.username);
    this.profileForm.get('phone').setValue(auth.phone);
    this.profileForm.get('address').setValue(auth.address);
    this.profileForm.get('state').setValue(auth.state);
    this.profileForm.get('country').setValue(auth.country);
    this.profileForm.get('photo').setValue(auth.photo);
  }

  private seoUpdate(url) {
    let title;
    
    title = 'Settings';
    this.pageTitle = title;
    this.seoService.updateTitle(title);
    this.seoService.updateDescription(title);
  }

  // private getBankInfo() {
  //   this.bankInfoService.getBankInfo().subscribe(res => {
  //     if (res && res.data) {
  //       this.updateBankFields(res.data);
  //     }
  //     this.loading = false;
  //   }, err => {
  //     this.loading = false;
  //   });
  // }

  // private updateBankFields(bank) {
  //   for (let key in this.bankForm.value) {
  //     if (bank[key]) {
  //       this[key].setValue(bank[key]);
  //     }
  //   }
  // }

  goto(page) {
    this.activePage = page;
  }

  submitPass() {
    if (this.passForm.invalid || this['password'].value != this['confirm_password'].value) return;
    this.passErr = null;
    this.submitting = true;
    const data = JSON.stringify(this.passForm.value);
    this.authService.changePass(data).subscribe(res => {
      this.successService.msg.next({
        title: 'Password Changed Successful',
        body: '',
        callBack: () => {
          this.authService.logoutAlt();
        }
      });
      this.submitting = false;
    }, err => {
      this.submitting = false;
      if (err.error.error) {
        this.passErr = err.error.error;
        this.currPassGroup.nativeElement.scrollIntoView(false);
      }
    });
  }

  treatImgUrl(url) {
    return this.configService.treatImgUrl(url);
  }


  selectFile(e, owner) {
    this.uploadingProgress.owner = owner;
    this[owner.replace('Url', 'Err')] = false;
    let file = e.target.files[0];
    this[owner] = URL.createObjectURL(file);
    this.onSelectedFile(file, owner);
  }

  onSelectedFile(file, owner) {
    const selectedFileName = file.name;
    const fd = new FormData;
    fd.append('file', file, selectedFileName);
    this.uploadingProgress.count = 1;
    this.fileUploadService.upload(
      fd, owner.replace('Url', ''), `user_${owner.replace('Url', '')}`
    )
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadingProgress.count = Math.round(event.loaded / event.total * 100);
        } else if (event.type === HttpEventType.Response) {
          if (event.body.data) {
            this[owner] = event.body.data;
            if (owner.includes('photo')) {
              this.profileForm.get('photo').setValue(this[owner]);
            }
          }
          this.uploadingProgress.count = 0;
        }
      }, err => {
        this[owner.replace('Url', 'Err')] = true;
        this[owner] = owner == 'photoUrl' ? this['photo'].value : this['proof_of_identity'].value;
        this.uploadingProgress.count = 0;
      });
  }


  submitProfile() {
    if (this.profileForm.invalid) return;
    this.submitting = true;
    const data = JSON.stringify(this.profileForm.value);
    this.authService.updateProfile(data).subscribe(res => {
      if(res){
        this.successService.msg.next({
          title: 'Update is successful',
          body: '',
        });
        this.emailErr = '';
        this.usernameErr = '';
      }
      this.submitting = false;
    }, err => {
      this.submitting = false;
      console.log(err.error.error);
      if (err.error.error) {
        if(err.error.error == 'Oops! this email has been taken'){
          this.emailErr = err.error.error;
          this.emailGroup.nativeElement.scrollIntoView(false);
        } else if(err.error.error == 'Oops! this username has been taken'){
          this.usernameErr = err.error.error;
          this.usernameGroup.nativeElement.scrollIntoView(false);
        }
      }
    });
  }

}
