import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { ErrorHandlerService } from 'src/app/data/services/error-handler.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
// import { NewsService } from 'src/app/data/services/investor/news.service';
// import { NotificationService } from 'src/app/data/services/investor/notification.service';
import { SuccessService } from 'src/app/data/services/success.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit, AfterViewInit {
  @Input() pageTitle;
  @ViewChild('successOpener') successOpener: ElementRef;
  @ViewChild('errorOpener') errorOpener: ElementRef;
  successMsg;
  errorMsg;
  closeModal = new BehaviorSubject(false);
  auth;
  notifications = [];
  settings;
  newsList = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService,
    private successService: SuccessService,
    private errorService: ErrorHandlerService,
    private generalSettings: GeneralSettingsService,
  ) { }

  ngOnInit(): void {
    let actRoute = this.router.url.split('/').slice(-1)[0];
    if (!this.pageTitle) {
      this.pageTitle = actRoute.replace(/-/g, ' ');
      this.pageTitle = this.pageTitle == 'investor' ? 'Dashboard' : this.pageTitle;
    }
    this.getAuth();
    this.getGenSet();
  }

  ngAfterViewInit() {
    this.checkSuccessMsg();
    this.checkErrorMsg();
  }

  private checkSuccessMsg() {
    this.successService.msg.subscribe(msg => {
      if (msg) {
        this.successMsg = msg;
        this.successOpener.nativeElement.click();
      }
    });
  }

  private checkErrorMsg() {
    this.errorService.errorResp.subscribe(err => {
      if (err) {
        this.errorMsg = 'Oops! An error occured. Please reload the page and try again later';
        this.errorOpener.nativeElement.click();
      }
    });
  }

  modalClose() {
    if (this.successMsg.callBack) {
      this.successMsg.callBack();
    }
    this.successService.msg.next(null);
  }

  private getGenSet() {
    this.generalSettings.genSettings.subscribe(res => {
      if (res) {
        this.settings = res.configuration;
        console.log(this.settings)
      }
    });
  }

  private getAuth() {
    this.authService.investor.subscribe(auth => {
      this.auth = auth;
      if(this.auth.email_verify != 1){
        this.router.navigateByUrl('/user/email-verification');
      }

      // if(this.auth.phone_verify != 1){
      //   this.router.navigateByUrl('/user/phone-verification');
      //   console.log("noy verify")
      // }
    });
  }
  

  showSideMenu(hd) {
    hd.parentElement.parentElement.parentElement.previousElementSibling.children[0].classList.add('showMenu');
  }

  treatImgUrl(url) {
    return this.configService.treatImgUrl(url);
  }

  errorClose() {
    this.errorService.errorResp.next(null);
  }

}
