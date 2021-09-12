import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersComponent, UserDialogFormComponent, } from './views';
import { UserService } from './user.service';
import { MaterialModule } from "../../shared/material.module";

@NgModule({
  declarations: [
    UsersComponent,
    UserDialogFormComponent,
  ],
  providers: [
    UserService,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports: [UsersComponent],
})
export class UserModule {
}
