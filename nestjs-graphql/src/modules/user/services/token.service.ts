import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, RefreshTokenInputDto } from '../dto';
import { AuthRepository, RefreshTokenRepository, UserRepository } from '../repositories';
import { AuthenticationError } from 'apollo-server-core';
import { logger } from '../../../config/logger';
import { JwtService } from '@nestjs/jwt';
import { jwtService } from '../../../config/services';
import { RefreshToken } from '../entities';

@Injectable()
export class TokenService {
  private readonly jwtService?: JwtService;

  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    this.jwtService = jwtService;
  }

  async createAccessToken(payload: JwtPayload): Promise<string> {
    try {
      return this.jwtService.sign(
        payload,
        {expiresIn: process.env.EXPIRE_TOKEN},
      );
    } catch (error) {
      logger.error(error.toString(), {});
    }
  }

  async createRefreshToken(refreshTokenInput: RefreshTokenInputDto): Promise<string> {
    try {
      /* Delete old refresh token */
      await this.refreshTokenRepository.findOneAndDelete({userId: refreshTokenInput.userId});

      /* Create new refresh token */
      const refreshToken = await this.refreshTokenRepository.createRefreshToken(refreshTokenInput);

      if (!refreshToken) {
        throw new Error('Fail to create refresh-token');
      }

      return refreshToken.token;
    } catch (error) {
      logger.error(error.toString(), {});
      throw new AuthenticationError(`Unauthorized: ${error}`);
    }
  }

  async findRefreshToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      token,
    });
  }
}
