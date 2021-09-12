import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from "@angular/platform-browser";

import { Role, User } from '../../models';
import { UserService } from '../../user.service';
import { UserDialogFormComponent } from "..";
import { AuthenticationService } from "../../../../auth/auth.service";
import { Router } from "@angular/router";
import { AppService } from "../../../../shared/services";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'name', 'email', 'avatar', 'createdAt', 'roles', 'action'];
  dataSource: User[];

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private titleService: Title,
    private authService: AuthenticationService,
    private router: Router,
    private appService: AppService,
  ) {
    this.titleService.setTitle('Nin - User List');
  }

  ngOnInit() {
    this.getUsers();
  }

  openDialog(id: string = ''): void {
    const dialogRef = this.dialog.open(UserDialogFormComponent, {
      width: '600px',
      data: {id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetDataSource();
      }
      console.log(result, 'The dialog was closed');
    });
  }

  resetDataSource() {
    this.getUsers();
  }

  private getUsers() {
    this.userService
      .getUsers()
      .subscribe(
        ({data}) => {
          this.dataSource = data.users
        },
        error => {
          console.log('error', error)
        }
      );
  }

  private deleteUsers(_id) {
    const variables = {_id: _id};
    this.userService.deleteUser(variables).subscribe(
      (res) => {
        if (res.data?.userDelete) {
          if (this.authService.userValue._id === _id) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          this.resetDataSource();
        }
      },
      error => console.log(error),
    );
  }

  private editUser(id) {
    this.openDialog(id);
  }

  showRolesStr(roles: Role[]): string {
    if (!roles) return '';
    return roles.map(r => r.name).join();
  }

  getAvatarUrl(fileName: string) {
    if (fileName)
      return `${this.appService.getResourceUrl()}${fileName}`;
    return '';
  }

}
