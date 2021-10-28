import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SupportManagerRoutingModule } from './support-manager-routing.module';
import { SupportComponent } from './components/support/support.component';
import { SupportSingleComponent } from './components/support-single/support-single.component';
import { SupportManagerMenuComponent } from './components/support-manager-menu/support-manager-menu.component';

@NgModule({
  declarations: [
    SupportComponent,
    SupportSingleComponent,
    SupportManagerMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SupportManagerRoutingModule,
    AdminSharedModule,
    AngularEditorModule
  ]
})
export class SupportManagerModule { }
