import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AnonymousGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticationService.isAuthenticate()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
