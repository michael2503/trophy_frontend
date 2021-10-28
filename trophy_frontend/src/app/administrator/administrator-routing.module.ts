import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../data/services/admin-auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLogoutComponent } from './admin-logout/admin-logout.component';

const routes: Routes = [
    { path: 'login', component: AdminLoginComponent },
    { path: 'logout', component: AdminLogoutComponent },
    {
        path: '',
        loadChildren: () => import(
            './dashboard-manager/dashboard-manager.module'
        ).then(mod => mod.DashboardManagerModule),
        canLoad: [AdminAuthGuard]
    },

    {
        path: 'settings-manager',
        loadChildren: () => import(
            './settings-manager/settings-manager.module'
        ).then(mod => mod.SettingsManagerModule),
        canLoad: [AdminAuthGuard]
    },

    {
        path: 'admin-manager',
        loadChildren: () => import(
            './admin-manager/admin-manager.module'
        ).then(mod => mod.AdminManagerModule),
        canLoad: [AdminAuthGuard]
    },

    {
        path: 'content-manager',
        loadChildren: () => import(
            './content-manager/content-manager.module'
        ).then(mod => mod.ContentManagerModule),
        canLoad: [AdminAuthGuard]
    },
    

    {
        path: 'user-manager',
        loadChildren: () => import(
            './user-manager/user-manager.module'
        ).then(mod => mod.UserManagerModule),
        canLoad: [AdminAuthGuard]
    },

    {
      path: 'testimonial-manager',
      loadChildren: () => import(
          './testimonial-manager/testimonial-manager.module'
      ).then(mod => mod.TestimonialManagerModule),
      canLoad: [AdminAuthGuard]
    },

    {
        path: 'support-manager',
        loadChildren: () => import(
            './support-manager/support-manager.module'
        ).then(mod => mod.SupportManagerModule),
        canLoad: [AdminAuthGuard]
      },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
