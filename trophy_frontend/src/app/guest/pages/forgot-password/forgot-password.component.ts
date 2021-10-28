import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { SuccessService } from 'src/app/data/services/success.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  activeSection = 'section1';
  emailErr;
  codeErr;
  submitting = false;
  curYear = new Date().getFullYear();

  // email form
  form = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  closeModal = new BehaviorSubject(false);

  get email() {
    return this.form.get('email');
  }

  // enter code form
  codeForm = new FormGroup({
    id: new FormControl('', Validators.required),
    email_code: new FormControl('', Validators.required),
  });

  get email_code() {
    return this.codeForm.get('email_code');
  }

  get validEmail() {
    let email = this['email'].value;
    let match = email.match(/[a-z0-9]+@[a-z0-9]+\.[a-z]+\.*[a-z]*(?!.)/i);
    return match;
  }

  // set new password form
  passForm = new FormGroup({
    id: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });

  get password() {
    return this.passForm.get('password');
  }

  get confirm_password() {
    return this.passForm.get('confirm_password');
  }

  constructor(
    private authService: AuthService,
    private successService: SuccessService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  // submit email
  submit() {
    if (this.form.invalid || !this.validEmail) return;
    this.submitting = true;
    this.emailErr = null;
    const data = JSON.stringify(this.form.value);
    this.authService.forgotPassEmailVerify(data).subscribe(res => {
      this.codeForm.get('id').setValue(res.data);
      this.activeSection = 'section2';
      this.submitting = false;
    }, err => {
      if (err.error.error) {
        this.emailErr = err.error.error;
      }
      this.submitting = false;
    });
  }


  // submit code
  codeSubmit() {
    if (this.codeForm.invalid) return;
    this.submitting = true;
    this.codeErr = null;
    const data = JSON.stringify(this.codeForm.value);
    this.authService.forgotPassCodeVerify(data).subscribe(res => {
      this.passForm.get('id').setValue(res.data);
      this.activeSection = 'section3';
      this.submitting = false;
    }, err => {
      if (err.error.error) {
        this.codeErr = err.error.error;
      }
      this.submitting = false;
    })
  }

  // submit new password
  passSubmit(sucOpen) {
    if (this.passForm.invalid || this.password.value != this.confirm_password.value) return;
    this.submitting = true;
    const data = JSON.stringify(this.passForm.value);
    this.authService.forgotPassReset(data).subscribe(res => {
      sucOpen.click();
    });
  }

  modalClose() {
    this.router.navigateByUrl('/login');
  }

}
