import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert, BeforeUpdate,
} from 'typeorm';
import * as uuid from 'uuid';
import { IsString, IsNotEmpty } from 'class-validator';
import { EncryptionHelper } from '../helpers';
import { Role } from './role.entity';

@Entity('user', {
  orderBy: {
    created_at: 'ASC',
  },
})
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Column({default: '/avatar.png'})
  @IsString()
  avatar: string;

  @Column({default: []})
  roles: Role[];

  @CreateDateColumn({type: 'timestamp', default: ''})
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
