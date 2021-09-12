import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import {
  getUsersQuery,
  createUserMutation,
  deleteUserMutation,
  getUserQuery,
  updateUserMutation,
  getRolesQuery
} from './queries';
import {
  CreateUserMutation,
  DeleteUserMutation,
  RolesQuery,
  UpdateUserMutation,
  UserQuery,
  UsersQuery
} from './models';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient, private apollo: Apollo) {
    this.apollo = apollo;
  }

  getUsers() {
    return this.apollo.watchQuery<UsersQuery>({
      query: getUsersQuery,
      variables: {},
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  getRoles() {
    return this.apollo.watchQuery<RolesQuery>({
      query: getRolesQuery,
      variables: {},
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  getUser(_id) {
    return this.apollo.watchQuery<UserQuery>({
      query: getUserQuery,
      variables: {_id},
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  createUsers(variables) {
    return this.apollo.mutate<CreateUserMutation>({
      mutation: createUserMutation,
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }

  updateUsers(variables) {
    return this.apollo.mutate<UpdateUserMutation>({
      mutation: updateUserMutation,
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }

  deleteUser(variables) {
    return this.apollo.mutate<DeleteUserMutation>({
      mutation: deleteUserMutation,
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }

}
