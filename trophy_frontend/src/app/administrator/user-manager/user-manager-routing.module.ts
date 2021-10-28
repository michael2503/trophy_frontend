import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListingComponent } from './components/user-listing/user-listing.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserEditDetailComponent } from './components/user-edit-detail/user-edit-detail.component';

const routes: Routes = [
    { path: '', component: UserListingComponent },
    { path: 'active', component: UserListingComponent },
    { path: 'blocked', component: UserListingComponent },
    { path: 'details/:id', component: UserDetailComponent },
    { path: 'details/edit/:id', component: UserEditDetailComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagerRoutingModule { }
