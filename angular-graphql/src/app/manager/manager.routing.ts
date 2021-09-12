import { Routes } from '@angular/router';
import { UsersComponent } from './user/views';
import { DashboardComponent } from "./dashboard/views";
import { ProfileComponent } from "./account/views";
import { AdminGuard } from "../auth/guards";

export const managerRoutes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
];
