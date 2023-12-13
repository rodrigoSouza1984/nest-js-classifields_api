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
  findAll(@Query() query: {
    userId: number;
    typeFilter: 'allUsers' | 'noAllUsers';
    page: number; 
    take: number; 
    orderBy: 'ASC' | 'DESC';
  }) {
    return this.pushNotificationDataBaseService.findAllByQuery(query);
  }

 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pushNotificationDataBaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePushNotificationDataBaseDto: UpdatePushNotificationDataBaseDto) {
    return this.pushNotificationDataBaseService.update(+id, updatePushNotificationDataBaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pushNotificationDataBaseService.remove(+id);
  }
}
