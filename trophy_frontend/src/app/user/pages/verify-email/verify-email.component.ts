import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  submitting = false;
  resending = false;
  successSent = false;
  form = new FormGroup({
    email_code: new FormControl('', Validators.required)
  });
  codeErr;
  curYear = new Date().getFullYear();

  get email_code() {
    return this.form.get('email_code');
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
      if (+auth.email_verify) {
        this.router.navigateByUrl('/user');
      }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.codeErr = null;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.authService.verifyEmail(data).subscribe(res => {
      if (res) {
        this.router.navigate(['/user'], { replaceUrl: true })
        console.log(res);
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
    this.authService.resendEmailCode().subscribe(res => {
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
