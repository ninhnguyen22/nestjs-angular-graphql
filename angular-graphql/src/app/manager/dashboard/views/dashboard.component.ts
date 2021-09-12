import { Component, OnInit } from '@angular/core';
// import { NotificationService } from 'src/app/core/services/notification.service';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from "../../../auth/auth.service";
import { NotificationService } from "../../../shared/services";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authService.userValue;
    this.titleService.setTitle('Nin - Dashboard');
    // this.logger.log('Dashboard loaded');

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome!');
    });
  }
}
