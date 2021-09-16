import { IsEmail, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { UserCreateInput } from '../../../graphql';
import { Unique } from '../../../config/validator';
import { User } from '../entities';

export class UserCreateInputDto extends UserCreateInput {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  @Validate(Unique, [User, 'email'])
  email: string;

}
