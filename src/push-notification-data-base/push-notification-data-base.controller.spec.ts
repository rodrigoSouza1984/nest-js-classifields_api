import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationDataBaseController } from './push-notification-data-base.controller';
import { PushNotificationDataBaseService } from './push-notification-data-base.service';

describe('PushNotificationDataBaseController', () => {
  let controller: PushNotificationDataBaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushNotificationDataBaseController],
      providers: [PushNotificationDataBaseService],
    }).compile();

    controller = module.get<PushNotificationDataBaseController>(PushNotificationDataBaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
