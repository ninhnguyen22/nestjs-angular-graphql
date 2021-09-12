import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
// import { NGXLogger } from 'ngx-logger';

import { NotificationService, SpinnerService } from "../../../../shared/services";
import { AuthenticationService } from "../../../../auth/auth.service";
import { User } from "../../../user/models";
import { ProfileService } from "../../profile.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  hideCurrentPassword: boolean;
  hideNewPassword: boolean;
  currentPassword: string;
  newPassword: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private profileService: ProfileService,
  ) {

    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
  }

  newPasswordConfirm: string;

  disableSubmit: boolean;

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordConfirm: ['', Validators.required],
    });

    this.form.get('currentPassword').valueChanges
      .subscribe(val => {
        this.currentPassword = val;
      });

    this.form.get('newPassword').valueChanges
      .subscribe(val => {
        this.newPassword = val;
      });

    this.form.get('newPasswordConfirm').valueChanges
      .subscribe(val => {
        this.newPasswordConfirm = val;
      });

    this.spinnerService.visibility.subscribe((value) => {
      this.disableSubmit = value;
    });
  }

  changePassword() {
    if (this.newPassword !== this.newPasswordConfirm) {
      this.notificationService.openSnackBar('New passwords do not match.');
      return;
    }

    const variables = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.profileService.updatePwProfile(variables).subscribe(
      (res) => {
        if (res.data.profilePwUpdate) {
          this.notificationService.openSnackBar('Password update success, Please login again!');
          this.authService.logout();
          this.router.navigate(['login']);
        } else {
          this.notificationService.openSnackBar('Password update fail!');
        }
        this.form.reset();
      },
      error => console.log(error),
    );
  }
}
