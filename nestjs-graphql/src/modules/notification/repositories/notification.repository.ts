import { Injectable } from '@nestjs/common';
import { EntityRepository, MongoRepository } from 'typeorm';
import { Notification } from '../entities';

@Injectable()
@EntityRepository(Notification)
export class NotificationRepository extends MongoRepository<Notification> {

  async getAll(condition: object = {}): Promise<Notification[]> {
    return await this.find({
      order: {createdAt: 'DESC'},
      cache: true,
      where: condition,
      take: 10,
    });
  }

}
