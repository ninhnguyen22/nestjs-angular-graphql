export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[]
}

export interface Role {
  name: string;
  code: string;
}

export type UsersQuery = {
  users: User[];
};

export type UserQuery = {
  user: User;
};

export type RolesQuery = {
  roles: Role[];
};

export type CreateUserMutation = {
  userCreate: User;
};

export type UpdateUserMutation = {
  userUpdate: boolean;
};

export type DeleteUserMutation = {
  userDelete: boolean;
};

export type LoginMutation = {
  userDelete: boolean;
  login: {
    token: string
    refreshToken: string
    user?: User
  }
};

export interface RefreshTokenMutation {
  refreshToken: {
    token: string
  }
}
