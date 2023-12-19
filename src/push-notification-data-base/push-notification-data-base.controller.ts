import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PushNotificationDataBaseService } from './push-notification-data-base.service';
import { CreatePushNotificationDataBaseDto } from './dto/create-push-notification-data-base.dto';
import { UpdatePushNotificationDataBaseDto } from './dto/update-push-notification-data-base.dto';

@Controller('push-notification-data-base')
export class PushNotificationDataBaseController {
  constructor(private readonly pushNotificationDataBaseService: PushNotificationDataBaseService) {}

  @Post()
  createPushInDataBase(@Body() createPushNotificationDataBaseDto: CreatePushNotificationDataBaseDto) {
    return this.pushNotificationDataBaseService.createPushInDataBase(createPushNotificationDataBaseDto);
  }

  @Get()
  findAllPushInDataBaseByQuerys(@Query() query: {
    userId: number;
    typeFilter: 'allUsers' | 'noAllUsers';
    page: number; 
    take: number; 
    orderBy: 'ASC' | 'DESC';
  }) {
    return this.pushNotificationDataBaseService.findAllPushInDataBaseByQuerys(query);
  }


  @Delete('')
  remove(@Body() pushInDataBaseId: number[]) {
    return this.pushNotificationDataBaseService.remove(pushInDataBaseId);
  }

}
