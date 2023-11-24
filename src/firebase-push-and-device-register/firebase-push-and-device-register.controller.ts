import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FirebasePushAndDeviceRegisterService } from './firebase-push-and-device-register.service';
import { CreateFirebaseDeviceRegisterDto } from './dto/create-firebase-device-register.dto';
import { CreatePushNotificationDto } from './dto/create-push-notification.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('firebase-push-and-device-register')
@Controller('firebase-push-and-device-register')
export class FirebasePushAndDeviceRegisterController {
  constructor(private readonly firebasePushAndDeviceRegisterService: FirebasePushAndDeviceRegisterService) {}

  @ApiOperation({
    summary: 'create Or Update Register Token',
    description: `method to create a new register token firebase for pushs, or too refresh this token`,
    tags: ['firebase-push-and-device-register'],
  })  
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrUpdateRegisterToken(@Body() data: CreateFirebaseDeviceRegisterDto) {
    return await this.firebasePushAndDeviceRegisterService.createOrUpdateRegisterToken(data);
  }

  @ApiOperation({
    summary: 'find All Token Registers',
    description: `method that get all tokens registereds`,
    tags: ['firebase-push-and-device-register'],
  })
  @ApiQuery({ name: 'page', description: 'number of page this pagination', required: false })
  @ApiQuery({ name: 'take', description: 'quantity itens per page', required: false })
  @ApiQuery({ name: 'orderBy', description: 'order that get bring itens asc or desc', required: false })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllTokenRegisters(@Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }) {
    return this.firebasePushAndDeviceRegisterService.findAllTokenRegisters(query);
  }

  @ApiOperation({
    summary: 'get One By User Owner RegisterId',
    description: `get item by user owner id `,
    tags: ['firebase-push-and-device-register'],
  })  
  @UseGuards(JwtAuthGuard)
  @Get(':userIdOwnerRegisterToken')
  getOneByUserOwnerRegisterId(@Param('userIdOwnerRegisterToken') userIdOwnerRegisterToken: number) {
    return this.firebasePushAndDeviceRegisterService.getOneByUserOwnerRegisterId(userIdOwnerRegisterToken);
  }  

  @ApiOperation({
    summary: 'delete One By User Owner Id and register Id',
    description: `delete item by user owner id and register id `,
    tags: ['firebase-push-and-device-register'],
  }) 
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/:registerId')
  remove(@Param('userId') userId: number, @Param('registerId') registerId: number) {
    return this.firebasePushAndDeviceRegisterService.remove(userId, registerId);
  }

  @ApiOperation({
    summary: 'send PushNotification method',
    description: `send a push notification by CreatePushNotificationDto`,
    tags: ['firebase-push-and-device-register'],
  })
  @UseGuards(JwtAuthGuard)
  @Post('sendPushNotification')
  sendPushNotification(@Body() data: CreatePushNotificationDto) {    
    return this.firebasePushAndDeviceRegisterService.sendPushNotification(data);
  }

  
}
