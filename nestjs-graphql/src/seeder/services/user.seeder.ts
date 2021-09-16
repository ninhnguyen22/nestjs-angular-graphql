import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder';
import * as uuid from 'uuid';
import { EncryptionHelper } from '../../modules/user/helpers';

@Injectable()
export class UserSeeder extends Seeder {
  collection(): string {
    return 'users';
  }

  data(): any[] {
    const admin = {
      _id: uuid.v1(),
      name: 'admin',
      email: 'admin@local.dev',
      password: EncryptionHelper.encrypt('123456'),
      avatar: '/avatar.png',
      roles: [{code: 'admin', name: 'admin'}],
      lastNotifyAt: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return [admin];
  }

}
