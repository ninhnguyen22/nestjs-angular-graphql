import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ProfileUpdateDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  email: string;
}
