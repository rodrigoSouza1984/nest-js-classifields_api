import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationDataBaseService } from './push-notification-data-base.service';

describe('PushNotificationDataBaseService', () => {
  let service: PushNotificationDataBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationDataBaseService],
    }).compile();

    service = module.get<PushNotificationDataBaseService>(PushNotificationDataBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
