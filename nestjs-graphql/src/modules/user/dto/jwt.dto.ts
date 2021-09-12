import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JwtPayload {
  @Expose()
  id: string;
}
