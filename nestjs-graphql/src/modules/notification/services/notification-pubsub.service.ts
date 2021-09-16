import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NotificationCreateDto } from '../dto';
import { NotificationService } from './notification.service';
import { User } from '../../../graphql';

const pubSub = new PubSub();

@Injectable()
export class NotificationPubSubService {
  constructor(
    private readonly notificationService: NotificationService,
  ) {
  }

  async subscribe() {
    return pubSub.asyncIterator('notify');
  }

  async subscribeAdmin() {
    return pubSub.asyncIterator('notifyAdmin');
  }

  publish(user: User, notificationCreateDto: NotificationCreateDto): void {
    this.notificationService.create(user, notificationCreateDto)
      .then(res => {
        if (res) {
          if (notificationCreateDto.isAdmin) {
            const notifyAdmin = {userId: user._id, message: notificationCreateDto.message, createdAt: new Date()};
            pubSub.publish('notifyAdmin', {notifyAdmin});
          } else {
            const notify = {userId: user._id, message: notificationCreateDto.message, createdAt: new Date()};
            pubSub.publish('notify', {notify});
          }
        }
      });
  }

  publishLogged(user: User): void {
    const notify = {
      message: `${user.name} logged!`,
      isAdmin: true,
    };
    this.publish(user, notify);
  }

}
