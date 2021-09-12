import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto, LoginResponseUserDto, RefreshTokenDto } from '../dto';
import { AuthRepository } from '../repositories';
import { AuthenticationError } from 'apollo-server-core';
import { logger } from '../../../config/logger';
import { JwtService } from '@nestjs/jwt';
import { jwtService } from '../../../config/services';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly jwtService?: JwtService;

  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {
    this.jwtService = jwtService;
  }

  async login(input: LoginUserDto): Promise<LoginResponseUserDto> {
    try {
      const {email, password} = input;

      const user = await this.authRepository.findOne({email});
      if (!user || !(await user.matchesPassword(password))) {
        return null;
      }

      /* Create Access Token */
      const token = await this.tokenService.createAccessToken({
        id: user._id,
      });

      /* Create Refresh Token */
      const refreshToken = await this.tokenService.createRefreshToken({
        userId: user._id,
      });

      return {token, refreshToken, user};

    } catch (error) {
      logger.error(error.toString(), {});
      throw new AuthenticationError(error.toString());
    }
  }

  async refreshToken(token: string): Promise<RefreshTokenDto> {
    try {
      const refreshToken = await this.tokenService.findRefreshToken(token);

      /* Create Access Token */
      const accessToken = await this.tokenService.createAccessToken({
        id: refreshToken.userId,
      });

      return {token: accessToken};
    } catch (error) {
      logger.error(error.toString(), {});
      throw new AuthenticationError(`Unauthorized: ${error}`);
    }
  }
}
