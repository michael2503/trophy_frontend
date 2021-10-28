import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticContentService } from 'src/app/data/services/guest/static-content.service';
import { SEOService } from 'src/app/data/services/seo.service';
import { SuccessService } from 'src/app/data/services/success.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  submitting = false;

  form = new FormGroup({
    full_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  });

  constructor(
    private seoService: SEOService,
    private staticContentService: StaticContentService,
    private successService: SuccessService,
  ) { }

  // validate email
  get validEmail() {
    let email = this['email'].value;
    let match = email.match(/[a-z0-9]+@[a-z0-9]+\.[a-z]+\.*[a-z]*(?!.)/i);
    return match;
  }

  ngOnInit(): void {
    // form getter
    for (let key in this.form.value) {
      Object.defineProperty(this, key, { get: () => this.form.get(key) });
    }
  }

  // submit contact form
  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.staticContentService.contactUs(data).subscribe(res => {
      this.submitting = false;
      this.form.reset();
      this.successService.msg.next({
        title: 'Message Sent Successfully',
        body: 'You message has been successfully sent to us. We would get back to you soonest.',
      });
    }, err => {
      this.submitting = false;
    });
  }
}
