import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './views';
import { MaterialModule } from "../../shared/material.module";

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {
}
