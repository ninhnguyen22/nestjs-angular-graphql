import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserCreateDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsNotEmpty()
  roles: string[];

  constructor(user: any = null) {
    if (user) {
      this.name = user.name;
      this.password = user.password;
      this.email = user.email;
      this.roles = user.roles;
    }
  }
}
