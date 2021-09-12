import { Injectable } from '@nestjs/common';
import { EntityRepository, MongoRepository } from 'typeorm';
import { User } from '../entities';

@Injectable()
@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  async getAll(condition: object = {}): Promise<User[]> {
    return await this.find({
      cache: true,
      where: condition,
    });
  }
}
