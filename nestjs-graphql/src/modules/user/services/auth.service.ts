import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../repositories';
import { AuthenticationError } from 'apollo-server-core';
import { logger } from '../../../config/logger';
import { JwtService } from '@nestjs/jwt';
import { jwtService } from '../../../config/services';
import { TokenService } from './token.service';
import { LoginResponse, LoginUserInput, RefreshTokenResponse } from '../../../graphql';

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

  async login(input: LoginUserInput): Promise<LoginResponse> {
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

  async refreshToken(token: string): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = await this.tokenService.findRefreshToken(token);
      if (!refreshToken) {
        return {token: null};
      }

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
