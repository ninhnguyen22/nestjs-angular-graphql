import { IsEmail, IsOptional, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { RegisterInput } from '../../../graphql';
import { Unique } from '../../../config/validator';
import { User } from '../entities';

export class RegisterInputDto extends RegisterInput {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  @Validate(Unique, [User, 'email'])
  email: string;

}
