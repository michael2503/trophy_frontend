import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { AdminManagerService } from '../../../../data/services/administrator/admin-manager.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { SEOService } from '../../../../data/services/seo.service';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']
})
export class AdminChangePasswordComponent implements OnInit {
  isUpdating = false;
  updateError: any;
  adm: any;

  form = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPass: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    id: new FormControl('', [ ]),
  });

  constructor(
    private configService: ConfigService,
    private adminManagerService: AdminManagerService,
    private adminAuthService: AdminAuthService,
    private seoService: SEOService
  ) { }

  ngOnInit() {
    this.seoUpdate();
    this.updateAuth();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
        this.form.get('id').setValue(this.adm?.id);
      }
    });
  }

  submit() {
    this.isUpdating = true;
    const passOne = this.form.get('password').value;
    const passTwo = this.form.get('confirmPass').value;
    if(passOne != passTwo){
      alert("Oops, Password not matched");
      this.updateError = 'Oops, Password not matched';
      return;
    }
    const data = JSON.stringify(this.form.value);
    this.adminManagerService.changePassword(data).subscribe(res => {
      console.log(res);
      if(res){
        if(res.data == 'error'){
          alert('Oops! Old password is incorrect');
          this.updateError = 'Oops! Old password is incorrect';
        } else if(res.data = 1){
          alert('You have successfully changed your password');
          this.updateError = 'You have successfully changed your password';
          this.form.reset();
        } else {
          alert('Oops! Something went wrong, please try it again.');
          this.updateError = 'Oops! Something went wrong, please try it again.';
        }
      }
      this.isUpdating = false;
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('Change Password');
    this.seoService.updateDescription('Change Password');
  }

}
