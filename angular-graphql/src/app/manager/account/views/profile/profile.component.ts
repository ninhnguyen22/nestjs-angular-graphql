import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from "../../../../auth/auth.service";
import { ProfileService } from "../../profile.service";
import { User } from "../../../user/models";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;

  /* Grid*/
  breakpoint: number;

  constructor(
    private authService: AuthenticationService,
    private titleService: Title,
    private profileService: ProfileService,
  ) {
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth < 768 ) ? 1 : 2;
    this.getProfile();
  }

  onResize(event) {
    this.breakpoint = (window.innerWidth < 768 ) ? 1 : 2;
  }

  resetData(status) {
    if (status) {
      this.getProfile();
    }
  }

  private getProfile() {
    this.profileService
      .getProfile()
      .subscribe(
        ({data}) => {
          if (data.me) {
            this.user = data.me;
            this.titleService.setTitle(`Profile - ${data.me.name}`);
          }
        },
        error => console.log('error', error),
      );
  }


}
