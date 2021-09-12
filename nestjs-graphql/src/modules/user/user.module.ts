import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService, AuthService, TokenService, RoleService } from './services';
import { User } from './entities';
import { UserRepository, AuthRepository, RefreshTokenRepository } from './repositories';
import { FileUploadService } from '../../config/services';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository, AuthRepository, RefreshTokenRepository])],
  providers: [UserResolver, UserService, AuthService, TokenService, RoleService, FileUploadService],
  exports: [UserService],
})
export class UserModule {}
