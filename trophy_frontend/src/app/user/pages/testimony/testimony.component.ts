import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SEOService } from 'src/app/data/services/seo.service';
import { SuccessService } from 'src/app/data/services/success.service';
import { TestimonyService } from 'src/app/data/services/testimony.service';

@Component({
  selector: 'app-testimony',
  templateUrl: './testimony.component.html',
  styleUrls: ['./testimony.component.scss']
})
export class TestimonyComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(null),
    testimony: new FormControl('', Validators.required),
  });
  submitting = false;
  loading = true;

  get testimony() {
    return this.form.get('testimony');
  }

  constructor(
    private testimonyService: TestimonyService,
    private successService: SuccessService,
    private seoService: SEOService,
  ) { }

  ngOnInit(): void {
    this.seoUpdate();
    this.getTesti();
  }

  private seoUpdate() {
    this.seoService.updateTitle('My Testimony');
    this.seoService.updateDescription('My Testimony');
  }

  private getTesti() {
    this.testimonyService.getUserTestimony().subscribe(res => {
      if (res.data) {
        this.testimony.setValue(res.data.testimony);
        this.form.get('id').setValue(res.data.id);
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.testimonyService.postTestimony(data).subscribe(res => {
      this.submitting = false;
      this.successService.msg.next({
        title: 'Testimony Update Successful',
        body: ''
      });
    }, err => {
      this.submitting = false;
    })
  }

}
