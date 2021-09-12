import { ChangeDetectorRef, Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { MediaMatcher } from "@angular/cdk/layout";
import { SpinnerService } from "../shared/services";
import { AuthenticationService } from '../auth/auth.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit, OnDestroy, AfterViewInit {

  userName: string;

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  isAdmin: boolean;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private authenticationService: AuthenticationService,
    public spinnerService: SpinnerService,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const {name} = this.authenticationService.userValue;
    this.userName = name;
    this.isAdmin = this.authenticationService.isAdmin();
  }

  async logout() {
    await this.authenticationService.logout();
    /* Redirect to login page */
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
