import { PartialType } from '@nestjs/swagger';
import { CreatePushNotificationDataBaseDto } from './create-push-notification-data-base.dto';

export class UpdatePushNotificationDataBaseDto extends PartialType(CreatePushNotificationDataBaseDto) {}
