import { Injectable } from '@nestjs/common';
import { EntityRepository, MongoRepository } from 'typeorm';
import { RefreshToken } from '../entities';
import { RefreshTokenInputDto } from '../dto';
import { randomBytes } from 'crypto';
import * as moment from 'moment';

@Injectable()
@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends MongoRepository<RefreshToken> {
  async createRefreshToken(refreshTokenInput: RefreshTokenInputDto): Promise<RefreshToken> {
    const {userId} = refreshTokenInput;

    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.token = randomBytes(64).toString('hex');
    refreshToken.expiresAt = moment()
      .add(process.env.EXPIRE_REFRESH_TOKEN, 'd')
      .toDate();

    return this.save(refreshToken);
  }
}
