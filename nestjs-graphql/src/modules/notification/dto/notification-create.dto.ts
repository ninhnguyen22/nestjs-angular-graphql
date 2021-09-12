import { Expose } from 'class-transformer';

export class NotificationCreateDto {
  @Expose()
  message: string;

  @Expose()
  isAdmin: boolean;
}
