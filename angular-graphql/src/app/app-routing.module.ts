import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AnonymousGuard } from './auth';
import { LoginComponent } from './auth/login/login.component';
import { ManagerComponent } from "./manager/manager.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/manager',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard],
    data: {
      title: 'Login'
    }
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
    }],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
