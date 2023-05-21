import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMediaAvatarEntity } from '../user-media-avatar/entities/media-avatar.entity';
import { MediaAvatarDto } from '../user-media-avatar/dto/media-avatar.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import index from '../common/firebase';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MediaAvatarService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserMediaAvatarEntity) private userMediaAvatarRepository: Repository<UserMediaAvatarEntity>,
  ) { }

  async create(userId: number, data: MediaAvatarDto): Promise<User> {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId }, relations: ['mediaAvatar'] })

      if (userExists.mediaAvatar) {
        const mediaDeleted = await this.deleteMedia(userExists.id, userExists.mediaAvatar.name)        
      }

      const mediaExists = await this.userMediaAvatarRepository.findOne({ where: { name: data.name } })

      if (mediaExists) {
        throw new HttpException(`Media with this name, already there are only file with unique name name: ${data.name}`, HttpStatus.BAD_REQUEST);
      } 

      const sizeFile = (str) => {//function for calculation size of string, 100megabyte = 104857600 Bytes        
        let size = Buffer.from(str).length;
        return size
      }      

      if (sizeFile(data.base64) > 10485760) {
        throw new HttpException(
          `Video tem mais de 10 Megabytes não permitido, Arquivo: ${data.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const filePath = `classifields/users/${userId}/avatar/${data.name}`

      const url = await index.uploadBase64MediaToFirebaseStorage(data.base64, data.mimeType, filePath)
      
      if (!url) {
        throw new HttpException(`Avatar don't created there are some wrong in the bucket no returned url`, HttpStatus.BAD_REQUEST);
      } else {
        const media = new UserMediaAvatarEntity()

        media.name = data.name
        media.mimeType = data.mimeType
        media.url = url.toString()
        media.user = userExists

        const mediaSave = await this.userMediaAvatarRepository.save(media)        

        return await this.userRepository.findOne({ where: { id: userId }, relations: ['mediaAvatar'] })
      }
    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        console.log(err, 'err')
        return err
      }
    }
  }

  async deleteMedia(userId: number, fileName: string) {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId }, relations: ['mediaAvatar'] })

      if (!userExists) {
        throw new HttpException(`User not found! userId:${userId}`, HttpStatus.NOT_FOUND);
      }

      const filePath = `classifields/users/${userExists.id}/avatar/${fileName}`

      const deletedBucket = await index.deleteMediaToFirebaseStorage(filePath)

      if (deletedBucket) {
        await this.userMediaAvatarRepository.delete(userExists.mediaAvatar.id)

        return true
      }

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        console.log(err, 'err')
        return err
      }
    }
  }  
}

