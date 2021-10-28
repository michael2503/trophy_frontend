import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagerRoutingModule } from './content-manager-routing.module';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HomePageBannersComponent } from './components/home-page-banners/home-page-banners.component';
import { SharedModule } from '../../shared/shared.module';
import { HomePageBannersEditComponent } from './components/home-page-banners-edit/home-page-banners-edit.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { EmailTemplatesComponent } from './components/email-templates/email-templates.component';
import { EmailTemplateEditComponent } from './components/email-template-edit/email-template-edit.component';
import { ContentManagerMenuComponent } from './components/content-manager-menu/content-manager-menu.component';
import { WhoWeAreComponent } from './components/who-we-are/who-we-are.component';
import { PagesComponent } from './components/pages/pages.component';
import { EditPageComponent } from './components/edit-page/edit-page.component';


@NgModule({
  declarations: [
    HomePageBannersComponent,
    HomePageBannersEditComponent,
    EmailTemplatesComponent,
    EmailTemplateEditComponent,
    ContentManagerMenuComponent,
    WhoWeAreComponent,
    PagesComponent,
    EditPageComponent
  ],
  imports: [
    CommonModule,
    ContentManagerRoutingModule,
    HttpClientModule,
    AdminSharedModule,
    AngularEditorModule,
    // NgbModule,
    SharedModule
  ]
})
export class ContentManagerModule { }
