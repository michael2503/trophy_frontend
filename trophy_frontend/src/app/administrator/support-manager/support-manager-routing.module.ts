import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportSingleComponent } from './components/support-single/support-single.component';
import { SupportComponent } from './components/support/support.component';

const routes: Routes = [
    { path: '', component: SupportComponent },
    { path: 'read', component: SupportComponent },
    { path: 'unread', component: SupportComponent },
    { path: 'single/:id', component: SupportSingleComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportManagerRoutingModule { }
