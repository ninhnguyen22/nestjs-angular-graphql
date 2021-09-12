import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChangeAvatarComponent,
  ChangePasswordComponent,
  ChangeProfileComponent,
  ProfileComponent,
  ProfileDetailsComponent
} from './views';
import { MaterialModule } from "../../shared/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfileService } from "./profile.service";

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileDetailsComponent,
    ChangePasswordComponent,
    ChangeProfileComponent,
    ChangeAvatarComponent,
  ],
  providers: [
    ProfileService,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ProfileComponent],
})
export class AccountModule {
}
