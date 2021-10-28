import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { GeneralSettingsService } from './general-settings.service';

@Injectable({ providedIn: 'root' })
export class SEOService {
    // projectName: string;
    myInterval;
    bizName;

    constructor(
        private title: Title,
        private meta: Meta,
        private configService: ConfigService,
        private router: Router,
        private generalSettings: GeneralSettingsService,
    ) {
        // this.projectName = this.configService.getProject_name();
        generalSettings.genSettings.subscribe(res => {
            if (res) {
                this.bizName = res.websiteSettings.biz_name;
            }
        });
    }

    updateTitle(title: string) {
        this.updateOgPrefix('og:title', `${title} | ${this.bizName}`);
        // this.updateOgPrefix('twitter:title', `${title} | ${this.projectName}`);
        this.meta.updateTag({ name: 'twitter:title', content: title }, 'name="twitter:title"');
        this.title.setTitle(`${title} | ${this.bizName}`);
    }

    private updateOgPrefix(ogprop, value) {
        const prefixMeta = this.meta.getTags(`property="${ogprop}"`);
        for (let i = 0; i < prefixMeta.length; i++) {
            prefixMeta[i.toString()].setAttribute('content', value);
        }
    }

    updateOgImg(url = 'assets/images/connect-with-freelancers-on-oziconnect.jpg') {
        this.updateOgPrefix('og:image', url);
        this.updateOgPrefix('twitter:image', url);
        this.meta.updateTag({ name: 'twitter:image', content: url }, 'name="twitter:image"');
    }

    updateDescription(desc: string) {
        this.meta.updateTag({ name: 'description', content: desc + ' | ' + this.bizName }, 'name="description"');
        this.meta.updateTag({ name: 'twitter:description', content: desc + ' | ' + this.bizName }, 'name="twitter:description"');
        this.updateOgPrefix('og:description', `${desc} | ${this.bizName}`);
        // this.updateOgPrefix('twitter:description', `${desc} | ${this.bizName}`);
        this.updateOgPrefix('og:url', this.router.url);
    }

    updateKeyword(keywords: string) {
        this.meta.updateTag({ name: 'keywords', content: keywords + ' | ' + this.bizName }, 'name="keywords"');
    }

    stopInterval() {
        const me = this;
        clearInterval(me.myInterval);
    }
}
