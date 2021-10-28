import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SEOService } from 'src/app/data/services/seo.service';
import { SuccessService } from 'src/app/data/services/success.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  submitting = false;

  curYear = "2019";

  form = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]+\.*[a-z]*(?!.)/i)
    ]),
    phone: new FormControl('', Validators.required),
    interest: new FormControl(''),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    agree: new FormControl('', Validators.required),
  });

  get first_name() {
    return this.form.get('first_name');
  }
  get last_name() {
    return this.form.get('last_name');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  get confirm_password() {
    return this.form.get('confirm_password');
  }
  get interest() {
    return this.form.get('interest');
  }
  get agree() {
    return this.form.get('agree');
  }


  logoUrl;
  phoneErr;
  emailErr;
  usernameErr;

  
  @ViewChild('phoneGroup') phoneGroup: ElementRef;
  @ViewChild('emailGroup') emailGroup: ElementRef;
  @ViewChild('emailGroup') usernameGroup: ElementRef;


  constructor(
    private seoService: SEOService,
    private generalSettings: GeneralSettingsService,
    private config: ConfigService,
    private authService: AuthService,
    private router: Router,
    private successService: SuccessService,
  ) { }

  ngOnInit(): void {
    this.seoUpdate();
    this.getLogo();
  }


  private getLogo() {
    this.generalSettings.genSettings.subscribe(res => {
      if (res) {
        this.logoUrl = res.websiteSettings.logo_url;
      }
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('Signup');
    this.seoService.updateDescription('Signup');
  }

  //onclick to push interest into a array or remove from an array
  interestList = [];
  selectInterest(interest){
    if(this.interestList.length > 0){
      const index: number = this.interestList.indexOf(interest);
      if(index !== -1){
        this.interestList.splice(index, 1);
      } else {
        this.interestList.push(interest);
      }
    } else {
      this.interestList.push(interest);
    }
  }


  submit() {
    if (this.form.invalid) return;
    if(this.interestList.length > 0){
      this.form.get('interest').setValue(JSON.stringify(this.interestList));
    } else {
      this.successService.msg.next({
        title: 'Oops! please select at least on interest',
        body: '',
      });
      alert("Oops! please select at least on interest");
      return;
    }

    this.emailErr = null;
    this.phoneErr = null;
    this.submitting = true;
    
    const data = JSON.stringify(this.form.value);
    this.authService.signup(data).subscribe(res => {
      if (res && res.data) {
        this.router.navigateByUrl('/user');
      } else if(res.error){
        if(res.error == 'Oops! Email already exist'){
          this.emailErr = res.error;
          this.emailGroup.nativeElement.scrollIntoView();
        } else if(res.error == 'Oops! Phone number already exist'){
          this.phoneErr = res.error;
          this.phoneGroup.nativeElement.scrollIntoView();
        } else if(res.error == 'Oops! Username already exist'){
          this.usernameErr = res.error;
          this.usernameGroup.nativeElement.scrollIntoView();
        }
      }
      this.submitting = false;
      
    }, err => {
      if (err.error.error) {
        
      }
      this.submitting = false;
    });
  }


  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

  agreeCheck(check) {
    this['agree'].setValue(check.checked ? check.checked : '');
  }

}
