import { Module, Global } from '@nestjs/common';
import { PushNotificationDataBaseService } from './push-notification-data-base.service';
import { PushNotificationDataBaseController } from './push-notification-data-base.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushNotificationDataBaseEntity } from './entities/push-notification-data-base.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PushNotificationDataBaseEntity])],
  controllers: [PushNotificationDataBaseController],
  exports: [TypeOrmModule, PushNotificationDataBaseService],
  providers: [PushNotificationDataBaseService]
})
export class PushNotificationDataBaseModule {}




