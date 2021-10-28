import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  @ViewChild('userGroup') userGroup: ElementRef;
  @ViewChild('passGroup') passGroup: ElementRef;

  userErr;
  passErr;

  submitting = false;
  auth;
  logoUrl;

  curYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private seoService: SEOService,
    private router: Router,
    private generalSettings: GeneralSettingsService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.seoUpdate();
    this.checkAuth();
    this.getLogo();
    for (let key in this.form.value) {
      Object.defineProperty(this, key, { get: () => this.form.get(key) });
    }
  }

  private getLogo() {
    this.generalSettings.genSettings.subscribe(res => {
      if (res) {
        this.logoUrl = res.websiteSettings.logo_url;
      }
    });
  }

  //if authenticated user is accessing this page, redirect back to user dashbaord
  private checkAuth() {
    this.authService.checking.subscribe(checking => {
      if (!checking) {
        this.authService.investor.subscribe(auth => {
          if (auth) {
            this.router.navigateByUrl('/user');
          }
        });
      }
    });
  }

  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

  private seoUpdate() {
    this.seoService.updateTitle('Login');
    this.seoService.updateDescription('Login');
  }

  submit() {
    if (this.form.invalid) return;
    this.userErr = null;
    this.passErr = null;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.authService.login(data).subscribe(res => {
      console.log(res)
      if (res) {
        this.router.navigateByUrl('/user');
      }
      this.submitting = false;
    }, err => {
      if (err.error.error) {
        if (err.error.error.includes('record')) {
          this.userErr = err.error.error;
          this.userGroup.nativeElement.scrollIntoView();
        } else {
          this.passErr = err.error.error;
          this.passGroup.nativeElement.scrollIntoView();
        }
      }
      this.submitting = false;
    });
  }

}
