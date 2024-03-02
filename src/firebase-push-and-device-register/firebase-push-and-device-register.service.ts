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
import { PushNotificationDataBaseService } from 'src/push-notification-data-base/push-notification-data-base.service';
import { CreatePushNotificationDataBaseDto } from 'src/push-notification-data-base/dto/create-push-notification-data-base.dto';

@Injectable()
export class FirebasePushAndDeviceRegisterService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(FirebaseDeviceRegisterEntity) private firebaseDeviceRegisterEntityRepository: Repository<FirebaseDeviceRegisterEntity>,
    private pushNotificationDataBaseService: PushNotificationDataBaseService

  ) { }


  async createOrUpdateRegisterToken(data: CreateFirebaseDeviceRegisterDto) {
    try {

      if (!data.userId) {
        throw new HttpException(`property userId must be sended, no found`, HttpStatus.BAD_REQUEST)
      }

      if (!data.token) {
        throw new HttpException(`property token must be sended, no found`, HttpStatus.BAD_REQUEST)
      }

      const userExists = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndMapOne('user.registerFirebaseTokenExists', FirebaseDeviceRegisterEntity, 'registerFirebaseTokenExists', `registerFirebaseTokenExists.userId = ${data.userId}`)
        .where(`user.id = ${data.userId}`)

      const user: any = await userExists.getOne()

      if (!user) {
        throw new HttpException(`User not found user: ${data.userId}`, HttpStatus.BAD_REQUEST)
      }

      if (user.registerFirebaseTokenExists) {

        let updateRegisterToken: CreateFirebaseDeviceRegisterDto = { token: data.token }

        return await this.firebaseDeviceRegisterEntityRepository.save({ ...updateRegisterToken, id: Number(user.registerFirebaseTokenExists.id) })

      } else {

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

  async findAllTokenRegisters(queryParams: { page: number; take: number; orderBy: 'ASC' | 'DESC'; }) {
    try {

      let { page, take, orderBy } = queryParams;

      if (!page) page = 1;
      if (!take) take = 10;
      if (!orderBy) orderBy = 'DESC';

      const [tokenRegisters, total] = await this.firebaseDeviceRegisterEntityRepository.findAndCount({
        skip: take * (page - 1),
        take,
        order: { id: orderBy },
      })

      return [{ total: total, tokenRegisters: tokenRegisters }]

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

  async getOneByUserOwnerRegisterId(userIdOwnerRegisterToken: number) {
    try {

      const queryValidations = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndMapOne('user.registerFirebaseTokenExists', FirebaseDeviceRegisterEntity, 'registerFirebaseTokenExists', `registerFirebaseTokenExists.userId = ${userIdOwnerRegisterToken}`)
        .where(`user.id = ${userIdOwnerRegisterToken}`)

      const validations: any = await queryValidations.getOne()

      if (!validations) {
        throw new HttpException(`User not found user: ${userIdOwnerRegisterToken}`, HttpStatus.BAD_REQUEST)
      }

      if (!validations.registerFirebaseTokenExists) {
        throw new HttpException(`register not found user: ${userIdOwnerRegisterToken}`, HttpStatus.BAD_REQUEST)
      }

      return validations.registerFirebaseTokenExists

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

  async remove(userId: number, registerId: number) {
    try {

      const queryValidations = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndMapOne('user.registerFirebaseTokenExists', FirebaseDeviceRegisterEntity, 'registerFirebaseTokenExists', `registerFirebaseTokenExists.id = ${registerId}`)
        .where(`user.id = ${userId}`)

      const validations: any = await queryValidations.getOne()

      if (!validations) {
        throw new HttpException(`User not found user: ${userId}`, HttpStatus.BAD_REQUEST)
      }

      if (!validations.registerFirebaseTokenExists) {
        throw new HttpException(`register not found user: ${registerId}`, HttpStatus.BAD_REQUEST)
      }

      if (validations.typePermissionEnum !== 'admin') {
        throw new HttpException(`only user with permission admin can realize this action user: ${userId}`, HttpStatus.BAD_REQUEST)
      }

      return await this.firebaseDeviceRegisterEntityRepository.delete(registerId)

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

  async sendPushNotification(data: CreatePushNotificationDto) {
    try {

      let page = 1;
      let take = 500;

      if (!data.notification.title || data.notification.title === '') {
        throw new HttpException(`message must have a title`, HttpStatus.BAD_REQUEST)
      }

      if (!data.notification.body || data.notification.body === '') {
        throw new HttpException(`message must have a body`, HttpStatus.BAD_REQUEST)
      }

      // Verifica se a string contém '.com' e comeca 'https://'
      if (!data.notification.imageUrl.match(/\.com/) || !data.notification.imageUrl.match(/^https:\/\//)) {
        throw new HttpException(`message must have a url valid https://.....-.com or send '' cause not have a url`, HttpStatus.BAD_REQUEST)
      }

      if (data.notification.imageUrl === '') {
        delete data.notification.imageUrl
      }

      if (data.data === '') {
        delete data.data
      }

      if (data.tokens.length === 0) {

        const qtdTokenssRegistereds = await this.firebaseDeviceRegisterEntityRepository.count()

        if (qtdTokenssRegistereds === 0) {
          throw new HttpException(`no token registereds still`, HttpStatus.NOT_FOUND)
        }

        let qtdQuerysToRealized = Math.ceil(qtdTokenssRegistereds / 500);

        for (let x = 0; x < qtdQuerysToRealized; x++) {
          const queryToken = this.firebaseDeviceRegisterEntityRepository.createQueryBuilder('registerFirebase')
            .select('registerFirebase.token', 'token')

            .skip(take * (page - 1))
            .take(take)
            .orderBy('comment.id', 'DESC');

          const registeredsTokens = await queryToken.getRawMany();

          for await (const register of registeredsTokens) {
            data.tokens.push(register.token)
          }

          index.postPushNotification(data)

          page++
        }

        let pushInDataBase: CreatePushNotificationDataBaseDto = {
          message: data.notification.body ? data.notification.body : null,
          title: data.notification.title ? data.notification.title : null,
          imageUrl: data.notification.imageUrl ? data.notification.imageUrl : null,
          allUsers: true,
          icon: data.icon ? data.icon : null,
          userId: null
        }

        await this.pushNotificationDataBaseService.createPushInDataBase(pushInDataBase)

      } else {

        const notificationSend = index.postPushNotification(data)

        const queryUsers = await this.firebaseDeviceRegisterEntityRepository.createQueryBuilder('tokensRegistereds')
          .where('tokensRegistereds.token IN (:...tokens) ', { tokens: data.tokens })

        const tokensRegistereds: any = await queryUsers.getMany()

        if(tokensRegistereds.length > 0){
          console.log('aaaa')
        }

        for await (const tokenRegistered of tokensRegistereds) {

          let pushInDataBase: CreatePushNotificationDataBaseDto = {
            message: data.notification.body ? data.notification.body : null,
            title: data.notification.title ? data.notification.title : null,
            imageUrl: data.notification.imageUrl ? data.notification.imageUrl : null,
            allUsers: false,
            icon: data.icon ? data.icon : null,
            userId: tokenRegistered.userId
          }

          await this.pushNotificationDataBaseService.createPushInDataBase(pushInDataBase)

        }
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
}
