import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { NotificationService, SpinnerService, ValidationMessageService } from "../../../../shared/services";
import { AuthenticationService } from "../../../../auth/auth.service";
import { ProfileService } from "../../profile.service";
import { User } from "../../../user/models";
import { ProfileUpdateMutation } from "../../models";

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss']
})
export class ChangeProfileComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Output()
  resetData = new EventEmitter<boolean>();

  form: FormGroup;

  disableSubmit: boolean;

  constructor(
    private authService: AuthenticationService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private validationMsg: ValidationMessageService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.max(50)]],
    });
    this.spinnerService.visibility.subscribe((value) => {
      this.disableSubmit = value;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['user']) {
      if (this.form) {
        this.form.patchValue(this.user);
      }
    }
  }

  onSubmit() {
    const variables = {
      name: this.f.name.value,
      email: this.f.email.value,
    };
    if (this.form.errors) {
      return;
    }

    this.profileService.updateProfile(variables).subscribe(
      (res) => {
        if (res.data.profileUpdate) {
          this.notificationService.openSnackBar('Profile update success!');
          this.resetData.emit(true);
        } else {
          this.notificationService.openSnackBar('Profile update fail!');
          this.form.patchValue(this.user);
        }
      },
      error => console.log(error),
    );
  }

  get f() {
    return this.form.controls;
  }

  getErrorMessage(rule, ...$values) {
    return this.validationMsg.getErrorMessage(rule, $values);
  }

}
