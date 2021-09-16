import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../user.service';
import { NotificationService, ValidationMessageService } from "../../../../shared/services";

export interface DialogData {
  id: string;
}

@Component({
  selector: 'app-user-dialog-form',
  templateUrl: './user-dialog-form.component.html',
  styleUrls: ['./user-dialog-form.component.scss'],
})
export class UserDialogFormComponent implements OnInit {

  createStatus = true;

  @Output()
  resetData = new EventEmitter<boolean>();

  userCreateForm: FormGroup;
  roleData = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private validationMsg: ValidationMessageService,
    public dialogRef: MatDialogRef<UserDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInput: DialogData
  ) {
  }

  ngOnInit() {
    this.getRoles();
    this.userCreateForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(6)]],
      name: ['', [Validators.required, Validators.max(50)]],
      roles: []
    });

    /* Check for update user */
    if (this.dialogInput.id) {
      this.createStatus = false;
      /* Get user api */
      this.getUser(this.dialogInput.id);
      /* Remove pw validator */
      this.f.password.clearValidators();
      this.f.password.updateValueAndValidity();
      /* Disable input email */
      this.f.email.disable();
    }
  }

  onNoClick(): void {
    this.emitToUserList(false);
  }

  emitToUserList(resultData: boolean): void {
    this.dialogRef.close(resultData);
  }

  private getRoles() {
    this.userService
      .getRoles()
      .subscribe(
        ({data}) => {
          this.roleData = data.roles;
        },
        error => console.log('error', error),
      );
  }

  private getUser(_id) {
    this.userService
      .getUser(_id)
      .subscribe(
        ({data}) => {
          const userData = {...data.user, ...{roles: data.user.roles.map(r => r.code)}};

          this.userCreateForm.patchValue(userData);
        },
        error => console.log('error', error),
      );
  }

  get f() {
    return this.userCreateForm.controls;
  }

  getErrorMessage(rule, ...values) {
    return this.validationMsg.getErrorMessage(rule, values);
  }

  onSubmit() {
    const variables = {
      name: this.f.name.value,
      password: this.f.password.value,
      roles: this.f.roles.value,
    };
    if (this.userCreateForm.errors) {
      return;
    }

    if (this.createStatus) {
      this.userService.createUsers({...variables, ...{email: this.f.email.value}}).subscribe(
        (res) => {
          if (res.data.userCreate) {
            this.notificationService.openSnackBar('Created success!');
            this.userCreateForm.reset();
            this.emitToUserList(true);
          }
        },
        error => console.log(error),
      );
    } else {
      this.userService.updateUsers({...variables, ...{_id: this.dialogInput.id}}).subscribe(
        (res) => {
          if (res.data.userUpdate) {
            this.notificationService.openSnackBar('Updated success!');
            this.emitToUserList(true);
          }
        },
        error => console.log(error),
      );
    }
  }

}
