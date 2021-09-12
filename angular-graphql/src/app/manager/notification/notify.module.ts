import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotifyComponent } from './views';
import { MaterialModule } from "../../shared/material.module";
import { NotifyService } from "./notify.service";

@NgModule({
  declarations: [
    NotifyComponent,
  ],
  providers: [
    NotifyService
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports: [NotifyComponent],
})
export class NotifyModule {
}
