import { JwtService } from '@nestjs/jwt';
import { jwtCredentials } from '../config';

export const jwtService = new JwtService({
  signOptions: {
    algorithm: 'RS256',
  },
  ...jwtCredentials,
});
