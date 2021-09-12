import { IsString } from 'class-validator';

export class RefreshTokenInputDto {
  @IsString()
  userId: string;
}
