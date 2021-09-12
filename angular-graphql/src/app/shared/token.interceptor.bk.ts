import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, map } from 'rxjs/operators';
import { AuthenticationService } from '../auth/auth.service';
import { ApolloError } from "apollo-client";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercept')
    if (this.authService.getToken()) {
      request = this.addTokenToHeader(request, this.authService.getToken());
    }
    return next.handle(request)
      .pipe(
        catchError((error: any) => {
          window.location.href = "/"
          console.log('errorrr', error)

          if (error instanceof ApolloError) {
            console.log('errorrr')
          }

          // if (error instanceof HttpErrorResponse && !request.url.includes('/login') && this.authService.isTokenExpired()) {
          if (error instanceof HttpErrorResponse && !request.url.includes('/login')) {

            return this.handle401Error(request, next);
          } else {
            return throwError(error);
          }
        })
      );
  }

  private addTokenToHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        token: `${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.data.refreshToken.token);
          return next.handle(this.addTokenToHeader(request, res.data.refreshToken.token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(refreshToken => refreshToken != null),
        take(1),
        switchMap(res => {
          return next.handle(this.addTokenToHeader(request, res.data.refreshToken.token));
        }));
    }
  }
}
