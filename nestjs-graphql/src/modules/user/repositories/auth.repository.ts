import { Injectable } from '@nestjs/common';
import { EntityRepository, MongoRepository } from 'typeorm';
import { User } from '../entities';

@Injectable()
@EntityRepository(User)
export class AuthRepository extends MongoRepository<User> {}
