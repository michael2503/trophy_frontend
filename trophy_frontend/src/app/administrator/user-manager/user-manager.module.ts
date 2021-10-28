import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagerRoutingModule } from './user-manager-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserListingComponent } from './components/user-listing/user-listing.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserEditDetailComponent } from './components/user-edit-detail/user-edit-detail.component';
import { UserManagerMenuComponent } from './components/user-manager-menu/user-manager-menu.component';
import { UserInfoShareComponent } from './components/user-info-share/user-info-share.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';

@NgModule({
  declarations: [
    UserListingComponent,
    UserDetailComponent,
    UserEditDetailComponent,
    UserManagerMenuComponent,
    UserInfoShareComponent,
  ],
  imports: [
    CommonModule,
    UserManagerRoutingModule,
    SharedModule,
    AdminSharedModule
  ]
})
export class UserManagerModule { }
