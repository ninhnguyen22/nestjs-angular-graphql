import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService, NotificationPubSubService } from './services';
import { Notification } from './entities';
import { NotificationRepository } from './repositories';
import { NotificationResolver } from './notification.resolver';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationRepository])],
  providers: [NotificationResolver, NotificationService, NotificationPubSubService],
  exports: [NotificationService, NotificationPubSubService],
})
export class NotificationModule {
}
