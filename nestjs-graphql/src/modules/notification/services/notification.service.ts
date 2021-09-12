import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationCreateDto } from '../dto';
import { Notification } from '../entities';
import { NotificationRepository } from '../repositories';
import { User } from '../../user/entities';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.getAll({});
  }

  async findForAdmin(lastReadAt: string): Promise<any[]> {
    return Promise.all([
      this.notificationRepository.getAll({}),
      this.countByLastRead(lastReadAt, {}),
    ]);
  }

  async findForMember(lastReadAt: string): Promise<any[]> {
    return Promise.all([
      this.notificationRepository.getAll({isAdmin: false}),
      this.countByLastRead(lastReadAt, {isAdmin: false}),
    ]);
  }

  async countByLastRead(lastCreateAt: string, cond: object): Promise<number> {
    if (!lastCreateAt) {
      return await this.notificationRepository.count(cond);
    }
    return await this.notificationRepository.count({...cond, ...{createdAt: {$gt: new Date(lastCreateAt)}}});
  }

  async findById(_id: string): Promise<Notification> {
    return await this.notificationRepository.findOne({_id});
  }

  async create(user: User, notify: NotificationCreateDto): Promise<Notification> {
    const notifyEntity = new Notification();
    notifyEntity.userId = user._id;
    notifyEntity.message = notify.message;
    notifyEntity.isAdmin = notify.isAdmin || false;
    return await this.notificationRepository.save(notifyEntity);
  }

}
