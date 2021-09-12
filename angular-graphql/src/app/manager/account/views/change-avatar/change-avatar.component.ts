import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NotificationService, SpinnerService } from "../../../../shared/services";
import { AuthenticationService } from "../../../../auth/auth.service";
import { ProfileService } from "../../profile.service";

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.scss']
})
export class ChangeAvatarComponent implements OnInit {

  @Output()
  resetData = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fileName: [{value: '', disabled: true}],
      file: [''],
    });
  }

  fileChangeEvent(files: FileList) {
    if (files.item(0)) {
      this.f.fileName.setValue(files.item(0).name);
      const variables = {
        file: files.item(0)
      };
      this.profileService.updateAvatarProfile(variables).subscribe(
        (res) => {
          if (res.data?.profileAvatarUpdate) {
            this.f.fileName.setValue('');
            this.resetData.emit(true);
          }
        },
        error => console.log(error),
      );
    }
  }

  get f() {
    return this.form.controls;
  }

}
