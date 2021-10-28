import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/data/services/auth.service';
import { HomeService } from 'src/app/data/services/guest/home.service';

@Component({
  selector: 'app-call-to-action-bottom',
  templateUrl: './call-to-action-bottom.component.html',
  styleUrls: ['./call-to-action-bottom.component.scss']
})
export class CallToActionBottomComponent implements OnInit {
  callToAction;
  auth;
  constructor(
    private homeService: HomeService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getAuth();
    this.getData();
  }

  private getAuth() {
    this.authService.investor.subscribe(auth => {
      this.auth = auth;
    });
  }

  private getData() {
    this.homeService.homeData.subscribe(res => {
      if (res) {
        this.callToAction = res.data.callToAction;
      } else {
        this.homeService.getHomeData().subscribe();
      }
    });
  }

}
