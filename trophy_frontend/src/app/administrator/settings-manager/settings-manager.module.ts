import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsManagerRoutingModule } from './settings-manager-routing.module';

import { WebsiteSettingsComponent } from './components/website-settings/website-settings.component';

import { SettingsManagerMenuComponent } from './components/settings-manager-menu/settings-manager-menu.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SocialSettingsComponent } from './components/social-settings/social-settings.component';

@NgModule({
  declarations: [
    WebsiteSettingsComponent,
    SettingsManagerMenuComponent,
    SocialSettingsComponent
  ],

  imports: [
    CommonModule,
    SettingsManagerRoutingModule,
    AdminSharedModule
  ]
})
export class SettingsManagerModule { }
