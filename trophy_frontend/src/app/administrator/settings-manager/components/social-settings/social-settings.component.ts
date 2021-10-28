import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../data/services/seo.service';
import { RoutingService } from '../../../../data/helpers/routing.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { SocialManagerService } from 'src/app/data/services/administrator/social-manager.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-social-settings',
  templateUrl: './social-settings.component.html',
  styleUrls: ['./social-settings.component.scss']
})
export class SocialSettingsComponent implements OnInit {
  isLoading: any;
  allSocail: any;
  

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    url: new FormControl('', [
      Validators.required,
    ]),
    icon: new FormControl('', [
      Validators.required,
    ]),
  });

  get name() {
    return this.form.get('name');
  }
  get url() {
    return this.form.get('url');
  }
  get icon() {
    return this.form.get('icon');
  }

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private socialManagerService: SocialManagerService,
    private generalSettingsService: GeneralSettingsService,
    private routingService: RoutingService,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.getSocial();
    this.seoUpdate();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }
  
  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        const data = this.configService.isRootAdmin(res);
        if (!data) {
          this.routingService.replace(['/' + this.adminUrl + '/dashboard']);
        }
      }
    });
  }

  private getSocial(){
    this.generalSettingsService.getGenSettings().subscribe(res => {
      if(res) {
        this.allSocail = res.data.social_link;
      }
    })
  }

  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.form.value);
    this.socialManagerService.addSocialSettings(data).subscribe(res => {
      console.log(data);
      if (res) {
        this.getSocial();
        alert('Added successfully!');
        this.form.reset();
      } else {
        alert('Oops! We could not add your request.');
      }
      this.isLoading = false;
    });
  } 


  // DELETE
  deleteSocial(socialID: number) {
    if (confirm('Are you sure you want to DELETE this Social link?') ) {
      this.socialManagerService.deleteSocial(socialID).subscribe(res => {
        if(res){
          alert("Deleted successfully");
          this.ngOnInit();
        }
      });
    }
  }


  private seoUpdate() {
    this.seoService.updateTitle('Social Settings');
    this.seoService.updateDescription('Social Settings');
  }

}
