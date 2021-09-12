import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { loginMutation, refreshTokenMutation } from './queries';
import { UserToken, Role } from "./models";
import { LoginMutation, RefreshTokenMutation } from "../manager/user/models";

export const CURRENT_USER = 'currentUser';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private userSubject: BehaviorSubject<UserToken>;
  public user: Observable<UserToken>;

  constructor(private http: HttpClient, private apollo: Apollo) {
    this.apollo = apollo;
    this.userSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem(CURRENT_USER)));
    this.user = this.userSubject.asObservable();
  }

  /**
   * Get Current user values
   */
  public get userValue(): UserToken {
    return this.userSubject.value;
  }

  /**
   * Get user Token
   */
  getToken(): string {
    return this.userValue ? this.userValue.token : null;
  }

  /**
   * Get Refresh token
   */
  getRefreshToken(): string {
    return this.userValue ? this.userValue.refreshToken : null;
  }

  /**
   * Get roles
   */
  getRoles(): Role[] {
    return this.userValue ? this.userValue.roles : [];
  }

  isAdmin(): boolean {

    if (!this.isAuthenticate()) {
      return false;
    }

    const roles = this.getRoles();
    if (roles.length > 0 && roles.map(role => role.code).includes('admin')) {
      return true;
    }
    return false;
  }

  /**
   * Set User.
   * @param user
   */
  setUser(user: UserToken): void {
    this.userSubject.next(user);
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
  }

  /**
   * Set Token
   * @param token
   */
  setToken(token: string): void {
    const user = {...this.userValue, token};
    this.setUser(user);
  }

  /**
   * Set Refresh token
   * @param refreshToken
   */
  setRefreshToken(refreshToken: string): void {
    const user = {...this.userValue, refreshToken};
    this.setUser(user);
  }

  isAuthenticate(): boolean {
    return !!this.getToken();
  }

  /**
   * Call login query.
   * @param email
   * @param password
   */
  login(email: string, password: string) {
    return this.apollo.mutate<LoginMutation>({
      mutation: loginMutation,
      variables: {email, password},
      fetchPolicy: 'no-cache',
    });
  }

  /**
   * Call Refresh token query.
   */
  refreshToken() {
    return this.apollo.mutate<RefreshTokenMutation>({
      mutation: refreshTokenMutation,
      variables: {refreshToken: this.getRefreshToken()},
      fetchPolicy: 'no-cache',
    });
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem(CURRENT_USER);
    this.userSubject.next(null);
  }
}
