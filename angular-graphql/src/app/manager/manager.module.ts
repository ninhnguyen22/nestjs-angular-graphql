import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from '@angular/router';

import { managerRoutes } from './manager.routing';
import { UserModule } from './user';
import { MaterialModule } from "../shared/material.module";
import { DashboardModule } from "./dashboard";
import { AccountModule } from "./account";

import { ManagerComponent } from './manager.component';

import { SpinnerInterceptor } from "../shared/interceptors";
import { NotifyModule } from "./notification";

@NgModule({
  providers: [
   /* {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },*/
  ],
  declarations: [ManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(managerRoutes),
    MaterialModule,
    UserModule,
    DashboardModule,
    AccountModule,
    NotifyModule,
  ]
})
export class ManagerModule {
}
