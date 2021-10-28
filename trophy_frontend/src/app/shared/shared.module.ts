import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallToActionBottomComponent } from './components/call-to-action-bottom/call-to-action-bottom.component';
import { AllowNumDirective } from './directives/allow-num.directive';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { UserSidemenuComponent } from './components/user-sidemenu/user-sidemenu.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { ModalModule } from './modules/modal/modal.module';
import { LoadingBtnComponent } from './components/loading-btn/loading-btn.component';
import { CusAccordionComponent } from './components/cus-accordion/cus-accordion.component';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { StripHtmlPipe } from './pipe/strip-html.pipe';
import { SummaryPipe } from './pipe/summary.pipe';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { CopyTextDirective } from './directives/copy-text.directive';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CallToActionBottomComponent,
    AllowNumDirective,
    SafeUrlPipe,
    SafeHtmlPipe,
    UserSidemenuComponent,
    UserHeaderComponent,
    LoadingBtnComponent,
    CusAccordionComponent,
    TimeAgoPipe,
    DropdownDirective,
    StripHtmlPipe,
    SummaryPipe,
    PageLoaderComponent,
    CopyTextDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    CallToActionBottomComponent,
    AllowNumDirective,
    SafeUrlPipe,
    SafeHtmlPipe,
    UserSidemenuComponent,
    UserHeaderComponent,
    ModalModule,
    LoadingBtnComponent,
    CusAccordionComponent,
    TimeAgoPipe,
    DropdownDirective,
    StripHtmlPipe,
    SummaryPipe,
    PageLoaderComponent,
    CopyTextDirective,
  ]
})
export class SharedModule { }
