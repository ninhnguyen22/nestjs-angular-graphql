import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert, BeforeUpdate,
} from 'typeorm';
import * as uuid from 'uuid';
import { EncryptionHelper } from '../helpers';
import { Role } from './role.entity';

@Entity('users', {
  orderBy: {
    created_at: 'ASC',
  },
})
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column({
    type: 'string',
  })
  name: string;

  @Column({
    type: 'string',
  })
  password: string;

  @Column({
    type: 'string',
  })
  email: string;

  @Column({
    type: 'string',
    default: '',
  })
  avatar: string;

  @Column({
    type: 'array',
    default: [],
  })
  roles: Role[];

  @Column({type: 'timestamp', default: ''})
  lastNotifyAt: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: string;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: string;

  @BeforeInsert()
  async b4register() {
    this._id = await uuid.v1();
    // this.password = await EncryptionHelper.encrypt(this.password);
  }

  @BeforeUpdate()
  async b4update() {
    // this.password = await EncryptionHelper.encrypt(this.password);
  }

  async matchesPassword(password) {
    return EncryptionHelper.compare(password, this.password) ;
  }
}
