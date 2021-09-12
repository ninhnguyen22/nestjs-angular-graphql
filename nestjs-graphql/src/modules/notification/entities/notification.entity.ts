import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as uuid from 'uuid';
import { IsString, IsNotEmpty } from 'class-validator';

@Entity('notifications', {
  orderBy: {
    created_at: 'DESC',
  },
})
export class Notification {
  @ObjectIdColumn()
  _id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  message: string;

  @Column({default: false})
  isAdmin: boolean;

  @Column()
  userId: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: string;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: string;

  @BeforeInsert()
  async b4register() {
    this._id = await uuid.v1();
  }
}
