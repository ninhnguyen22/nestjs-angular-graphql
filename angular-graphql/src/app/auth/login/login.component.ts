import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from "../../shared/services";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    /* Redirect to home if already logged */
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    /* Pending Remember me function */

    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.authenticationService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (res) => {
          if (res.data?.login) {
            /* Authentication service set user */
            const user = res.data.login.user;
            this.authenticationService.setUser({
              _id: user._id,
              email: user.email,
              name: user.name,
              roles: user.roles,
              avatar: user.avatar,
              token: res.data.login.token,
              refreshToken: res.data.login.refreshToken,
            });
            /* Redirect to hone */
            this.router.navigate(['']);
          } else {
            this.notificationService.openSnackBar('Incorrect email or password');
          }
        },
        error => {
          const messagesErrors = error.graphQLErrors[0].message.message
            .map(item => item.message)
            .join('\n');
          console.log(messagesErrors)
          // throw new Error(messagesErrors);

        },
      );
  }
}
