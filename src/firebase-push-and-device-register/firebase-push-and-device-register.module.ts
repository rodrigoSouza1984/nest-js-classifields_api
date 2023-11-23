import { Module } from '@nestjs/common';
import { FirebasePushAndDeviceRegisterService } from './firebase-push-and-device-register.service';
import { FirebasePushAndDeviceRegisterController } from './firebase-push-and-device-register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseDeviceRegisterEntity } from './entities/firebase-device-register.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FirebaseDeviceRegisterEntity])],
  controllers: [FirebasePushAndDeviceRegisterController],
  providers: [FirebasePushAndDeviceRegisterService],
  exports: [TypeOrmModule, FirebasePushAndDeviceRegisterService ],
})
export class FirebasePushAndDeviceRegisterModule {}





