import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebsiteSettingsComponent } from './components/website-settings/website-settings.component';
import { SocialSettingsComponent } from './components/social-settings/social-settings.component';

const routes: Routes = [
    { path: '', component: WebsiteSettingsComponent },
    { path: 'website-settings', component: WebsiteSettingsComponent },
    { path: 'social-settings', component: SocialSettingsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsManagerRoutingModule { }
