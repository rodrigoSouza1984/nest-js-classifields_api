import { Injectable } from '@nestjs/common';
import { CreateFirebaseDeviceRegisterDto } from './dto/create-firebase-device-register.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseDeviceRegisterEntity } from './entities/firebase-device-register.entity';
import index from '../common/firebase';
import { CreatePushNotificationDto } from './dto/create-push-notification.dto';

@Injectable()
export class FirebasePushAndDeviceRegisterService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(FirebaseDeviceRegisterEntity) private firebaseDeviceRegisterEntityRepository: Repository<FirebaseDeviceRegisterEntity>,
  ) { }


  async createOrUpdateRegisterToken(data: CreateFirebaseDeviceRegisterDto) {
    try {

      if(!data.userId){
        throw new HttpException(`property userId must be sended, no found`, HttpStatus.BAD_REQUEST)
      }

      if(!data.token){
        throw new HttpException(`property token must be sended, no found`, HttpStatus.BAD_REQUEST)
      }

      const userExists = await this.userRepository.createQueryBuilder('user')      
      .leftJoinAndMapOne('user.registerFirebaseTokenExists', FirebaseDeviceRegisterEntity, 'registerFirebaseTokenExists', `registerFirebaseTokenExists.userId = ${data.userId}`)
      .where(`user.id = ${data.userId}`)

      const user : any = await userExists.getOne()      

      if(!user){
        throw new HttpException(`User not found user: ${data.userId}`, HttpStatus.BAD_REQUEST)
      }

      if(user.registerFirebaseTokenExists){

        let updateRegisterToken: CreateFirebaseDeviceRegisterDto = { token: data.token }

        return await this.firebaseDeviceRegisterEntityRepository.save({...updateRegisterToken, id: Number(user.registerFirebaseTokenExists.id)})

      }else{

        delete user.registerFirebaseTokenExists

        const registerToken = new FirebaseDeviceRegisterEntity()

        registerToken.userId = data.userId
        registerToken.token = data.token
        registerToken.user = user

        return await this.firebaseDeviceRegisterEntityRepository.save(registerToken)

      }

    } catch (err) {
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

  async findAllTokenRegisters(queryParams: {page: number; take: number; orderBy: 'ASC' | 'DESC'; }) {
    try{

      let { page, take, orderBy } = queryParams;

      if (!page) page = 1;
      if (!take) take = 10;
      if (!orderBy) orderBy = 'DESC';

      const [tokenRegisters, total] = await this.firebaseDeviceRegisterEntityRepository.findAndCount({        
        skip: take * (page - 1),
        take,
        order: { id: orderBy },
      })
      
      return [{total: total, tokenRegisters: tokenRegisters}]
      
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

  async getOneByUserOwnerRegisterId(userIdOwnerRegisterToken: number) {
    try{

      const queryValidations = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndMapOne('user.registerFirebaseTokenExists', FirebaseDeviceRegisterEntity, 'registerFirebaseTokenExists', `registerFirebaseTokenExists.userId = ${userIdOwnerRegisterToken}`)
      .where(`user.id = ${userIdOwnerRegisterToken}`)

      const validations : any = await queryValidations.getOne()      
      
      if(!validations){
        throw new HttpException(`User not found user: ${userIdOwnerRegisterToken}`, HttpStatus.BAD_REQUEST)
      }

      if(!validations.registerFirebaseTokenExists){
        throw new HttpException(`register not found user: ${userIdOwnerRegisterToken}`, HttpStatus.BAD_REQUEST)
      }

      return validations.registerFirebaseTokenExists      

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

  async remove(userId:number, registerId: number) {
    try{ 

      const queryValidations = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndMapOne('user.registerFirebaseTokenExists', FirebaseDeviceRegisterEntity, 'registerFirebaseTokenExists', `registerFirebaseTokenExists.id = ${registerId}`)
      .where(`user.id = ${userId}`)

      const validations : any = await queryValidations.getOne()      
      
      if(!validations){
        throw new HttpException(`User not found user: ${userId}`, HttpStatus.BAD_REQUEST)
      }

      if(!validations.registerFirebaseTokenExists){
        throw new HttpException(`register not found user: ${registerId}`, HttpStatus.BAD_REQUEST)
      }

      if(validations.typePermissionEnum !== 'admin'){
        throw new HttpException(`only user with permission admin can realize this action user: ${userId}`, HttpStatus.BAD_REQUEST)
      }

      return await this.firebaseDeviceRegisterEntityRepository.delete(registerId)

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

  async sendPushNotification(data: CreatePushNotificationDto){
    try{

      return index.postPushNotification(data)

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
