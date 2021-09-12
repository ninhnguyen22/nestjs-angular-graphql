import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../user/models";
import { AppService } from "../../../../shared/services";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  constructor(private appService: AppService,) {
  }

  @Input() user: User;


  ngOnInit() {
  }

  getRoles() {
    return this.user.roles.map(role => role.name).join();
  }

  getAvatarUrl(fileName: string) {
    if (fileName)
      return `${this.appService.getResourceUrl()}${fileName}`;
    return 'https://ninhnguyen22.github.io/blog/avatar.png';
  }
}
