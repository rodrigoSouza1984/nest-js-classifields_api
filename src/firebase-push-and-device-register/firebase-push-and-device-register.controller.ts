import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FirebasePushAndDeviceRegisterService } from './firebase-push-and-device-register.service';
import { CreateFirebaseDeviceRegisterDto } from './dto/create-firebase-device-register.dto';
import { CreatePushNotificationDto } from './dto/create-push-notification.dto';

@Controller('firebase-push-and-device-register')
export class FirebasePushAndDeviceRegisterController {
  constructor(private readonly firebasePushAndDeviceRegisterService: FirebasePushAndDeviceRegisterService) {}

  @Post()
  async createOrUpdateRegisterToken(@Body() data: CreateFirebaseDeviceRegisterDto) {
    return await this.firebasePushAndDeviceRegisterService.createOrUpdateRegisterToken(data);
  }

  @Get()
  findAllTokenRegisters(@Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }) {
    return this.firebasePushAndDeviceRegisterService.findAllTokenRegisters(query);
  }

  @Get(':userIdOwnerRegisterToken')
  getOneByUserOwnerRegisterId(@Param('userIdOwnerRegisterToken') userIdOwnerRegisterToken: number) {
    return this.firebasePushAndDeviceRegisterService.getOneByUserOwnerRegisterId(userIdOwnerRegisterToken);
  }  

  @Delete(':userId/:registerId')
  remove(@Param('userId') userId: number, @Param('registerId') registerId: number) {
    return this.firebasePushAndDeviceRegisterService.remove(userId, registerId);
  }

  @Post('sendPushNotification')
  sendPushNotification(@Body() data: CreatePushNotificationDto) {    
    return this.firebasePushAndDeviceRegisterService.sendPushNotification(data);
  }

  
}
