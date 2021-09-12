import { Context, Query, Resolver, Subscription } from '@nestjs/graphql';

import { NotificationPubSubService, NotificationService } from './services';
import { User } from '../user/entities';

@Resolver('User')
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationPubSubService: NotificationPubSubService,
  ) {
  }

  @Query()
  async notifications(
    @Context('currentUser') currentUser: User,
  ) {
    const lastNotifyAt = currentUser.lastNotifyAt || '';
    let result;
    if (currentUser.roles.map(role => role.code).includes('admin')) {
      result = await this.notificationService.findForAdmin(lastNotifyAt);
    }
    result = await this.notificationService.findForMember(lastNotifyAt);
    return {
      notifications: result[0],
      count: result[1],
    };
  }

  @Subscription('notify')
  notify() {
    return this.notificationPubSubService.subscribe();
  }

  @Subscription('notifyAdmin')
  notifyAdmin() {
    return this.notificationPubSubService.subscribeAdmin();
  }

}
