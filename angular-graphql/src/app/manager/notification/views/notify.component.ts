import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifyService } from "../notify.service";
import { Notify } from "../notify.model";
import { MatMenuTrigger } from "@angular/material/menu";
import { AuthenticationService } from "../../../auth/auth.service";

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {

  @ViewChild('menuTrigger') trigger: MatMenuTrigger;

  notifyCount: number;
  notifications: Notify[];

  constructor(
    private notifyService: NotifyService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.notifyService
      .getNotifications()
      .subscribe(async res => {
        if (res.data && res.data.notifications) {
          this.notifyCount = res.data.notifications.count;
          this.notifications = res.data.notifications.notifications;
          this.subscribeNotification();
        }
      }, error => {
        console.log(error)
      });
  }

  readNotification() {
    /* Check new notify */
    if (this.notifyCount > 0 && this.notifications.length > 0) {
      const lastNotifyAt = this.notifications[0].createdAt;
      if (lastNotifyAt) {
        this.notifyService.updateLastNotifyAt({lastNotifyAt}).subscribe(
          (res) => {
            if (res.data.lasNotifyUpdate) {
              this.notifyCount = 0;
            }
          },
          error => console.log(error),
        );
      }
    }
  }

  subscribeNotification() {
    const roles = this.authenticationService.userValue.roles;
    if (roles.map(r => r.code).includes('admin')) {
      this.notifyService.subscribeAdminNotify().subscribe(async res => {
        if (res.data && res.data.notifyAdmin) {
          console.log(res.data.notifyAdmin)
          this.notifications.unshift(res.data.notifyAdmin);
          this.notifyCount++;
        }
      }, error => {
        const messagesErrors = error.graphQLErrors[0].message;
        console.log(messagesErrors)
      });
    } else {
      this.notifyService.subscribeNotify().subscribe(async res => {
        if (res.data && res.data.notify) {
          console.log(res.data.notify)
          this.notifications.unshift(res.data.notify);
          this.notifyCount++;
        }
      }, error => {
        const messagesErrors = error.graphQLErrors[0].message;
        console.log(messagesErrors)
      });
    }
  }

}
