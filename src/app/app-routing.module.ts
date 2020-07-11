import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@shared/components/error-page/error-page.component';
import { AuthGuard } from './core/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'business',
    loadChildren: () => import('@modules/business/business.module').then(m => m.BusinessModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'wallet-creation',
    loadChildren: () => import('@modules/wallet/wallet.module').then(m => m.WalletModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('@modules/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'login',
    loadChildren: () => import('@modules/login/login.module').then(m => m.LoginModule)
  },
  { path: 'page-not-found', component: ErrorPageComponent },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
