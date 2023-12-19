import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePushNotificationDataBaseDto } from './dto/create-push-notification-data-base.dto';
import { UpdatePushNotificationDataBaseDto } from './dto/update-push-notification-data-base.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PushNotificationDataBaseEntity } from './entities/push-notification-data-base.entity';

@Injectable()
export class PushNotificationDataBaseService {

  constructor(
    @InjectRepository(PushNotificationDataBaseEntity) private pushNotificationDataBaseRepository: Repository<PushNotificationDataBaseEntity>,   
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async createPushInDataBase(data: CreatePushNotificationDataBaseDto) {
    try{

      const push = new PushNotificationDataBaseEntity()

      push.message = data.message ? data.message : null
      push.title = data.title ? data.title : null
      push.imageUrl = data.imageUrl ? data.imageUrl : null
      push.allUsers = data.allUsers ? data.allUsers : false
      push.icon = data.icon ? data.icon : null
      push.userId = data.userId ? data.userId : null

      const pushDataBaseCreated = await this.pushNotificationDataBaseRepository.save(push) 

      return pushDataBaseCreated

    }catch(err){
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async findAllPushInDataBaseByQuerys(query: {
    userId: number;
    typeFilter: 'allUsers' | 'noAllUsers';
    page: number; 
    take: number; 
    orderBy: 'ASC' | 'DESC';
  }) {

    let {userId, typeFilter, page, take, orderBy} = query

    if (!page) page = 1;
    if (!take) take = 10;
    if (!orderBy) orderBy = 'DESC';

    const queryNotifications =  this.pushNotificationDataBaseRepository.createQueryBuilder('notifications')
    
    if(typeFilter && typeFilter === 'allUsers'){
      queryNotifications.andWhere('notifications.allUsers = :booleanValue', {booleanValue : true})
    }else if(typeFilter && typeFilter === 'noAllUsers'){
      queryNotifications.andWhere('notifications.allUsers = :booleanValue', {booleanValue : false})
    }

    if(userId){
      queryNotifications.andWhere(`notifications.userId = ${userId}`)
    }

    const [notifications, total]: any = await queryNotifications.getManyAndCount()

    return {total: total, notifications: notifications}
    
  }  

  async remove(pushInDataBaseId: number[]) {
    try{

      return await this.pushNotificationDataBaseRepository.delete(pushInDataBaseId)

    }catch(err){
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }
}
