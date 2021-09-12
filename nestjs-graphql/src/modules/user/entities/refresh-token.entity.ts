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

@Entity('refresh_token', {
  orderBy: {
    created_at: 'ASC',
  },
})
export class RefreshToken {
  @ObjectIdColumn()
  _id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  token: string;

  @CreateDateColumn({type: 'timestamp'})
  @IsNotEmpty()
  expiresAt: Date;

  @Column()
  @IsString()
  @IsNotEmpty()
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
