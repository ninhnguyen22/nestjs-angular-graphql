export class Role {
  name: string;
  code: string;
}

export class UserToken {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  roles: Role[];
  token?: string;
  refreshToken?: string;
}
