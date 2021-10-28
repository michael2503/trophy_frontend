import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currYear = new Date().getFullYear();
  settings;
  constructor(
    private generalSettings: GeneralSettingsService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.getSettings();
  }

  treatImgUrl(url) {
    return this.config.treatImgUrl(url);
  }

  private getSettings() {
    this.generalSettings.genSettings.subscribe(res => {
      this.settings = res;
    });
  }

}
