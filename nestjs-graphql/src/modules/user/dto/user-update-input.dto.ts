import { IsString, MaxLength } from 'class-validator';
import { UserUpdateInput } from '../../../graphql';

export class UserUpdateInputDto extends UserUpdateInput {

  @IsString()
  @MaxLength(50)
  name: string;
}
