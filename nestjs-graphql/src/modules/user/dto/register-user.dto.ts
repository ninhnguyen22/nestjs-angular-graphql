import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsNotEmpty()
  email: string;

  constructor(user: any = null) {
    if (user) {
      this.name = user.name;
      this.password = user.password;
      this.email = user.email;
    }
  }
}
