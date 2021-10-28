import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})
export class VerifyPhoneComponent implements OnInit {
  submitting = false;
  resending = false;
  successSent = false;
  form = new FormGroup({
    phone_code: new FormControl('', Validators.required)
  });
  codeErr;
  curYear = new Date().getFullYear();

  get phone_code() {
    return this.form.get('phone_code');
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.checkAuth();
  }

  private checkAuth() {
    this.authService.investor.subscribe(auth => {
      if (+auth.phone_verify) {
        this.router.navigateByUrl('/user');
      }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.codeErr = null;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.authService.verifyPhone(data).subscribe(res => {
      console.log(res);
      if (res && res.id) {
        // this.router.navigate(['/user'], { replaceUrl: true })
      }
      this.submitting = false;
    }, err => {
      if (err.error.error) {
        this.codeErr = err.error.error;
      }
      this.submitting = false;
    });
  }

  resend() {
    this.resending = true;
    this.authService.resendPhoneCode().subscribe(res => {
      this.successSent = true;
      setTimeout(() => {
        this.successSent = false;
      }, 3000);
      this.resending = false;
    }, err => {
      if (err.status == 500) {
        this.successSent = true;
        setTimeout(() => {
          this.successSent = false;
        }, 3000);
      }
      this.resending = false;
    });
  }

}
