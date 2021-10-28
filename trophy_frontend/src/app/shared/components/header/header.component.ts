import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { ErrorHandlerService } from 'src/app/data/services/error-handler.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SuccessService } from 'src/app/data/services/success.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  dropMenu = false;
  auth;
  closeModal = new BehaviorSubject(false);
  successMsg;
  logoUrl;
  errorMsg;
  @ViewChild('successOpener') successOpener: ElementRef;
  @ViewChild('errorOpener') errorOpener: ElementRef;

  constructor(
    private authService: AuthService,
    private successService: SuccessService,
    private errorService: ErrorHandlerService,
    private generalSettings: GeneralSettingsService,
  ) { }

  ngOnInit(): void {
    this.getAuth();
  }

  ngAfterViewInit() {
    this.checkSuccessMsg();
    this.checkErrorMsg();
    this.getSettings();
  }

  private getSettings() {
    this.generalSettings.genSettings.subscribe(res => {
      if (res) {
        this.logoUrl = res.websiteSettings.logo_url;
      }
    });
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
    this.successService.msg.next(null);
  }

  errorClose() {
    this.errorService.errorResp.next(null);
  }

  private getAuth() {
    this.authService.investor.subscribe(auth => {
      this.auth = auth;
    });
  }

  
  logout() {
    this.authService.logoutAlt();
  }

}
