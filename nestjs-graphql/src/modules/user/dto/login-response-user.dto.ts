import { IsOptional, IsString } from 'class-validator';
import { User } from '../entities';

export class LoginResponseUserDto {
  @IsString()
  token: string;

  @IsString()
  refreshToken: string;

  @IsOptional()
  user?: User;
}
