import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductMediaEntity } from './entities/product-media.entity';
import index from '../common/firebase';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductMediaService {

  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductMediaEntity) private productMediaRepository: Repository<ProductMediaEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }


  async addMediasProduct(userId: number, productId: number, dataBody: CreateProductMediaDto[]) {
    try {

      if (dataBody.length > 5) {
        throw new HttpException(`Have more than 5 medias at body, maximun 5 medias`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.userRepository.findOne({ where: { id: userId }, relations: ['mediaAvatar'] })

      if (!userExists) {
        throw new HttpException(`User not found! userId:${userId}`, HttpStatus.NOT_FOUND);
      }

      const productExists = await this.productRepository.findOne({ where: { id: productId }, relations: ['mediasProduct'] })

      if (!productExists) {
        throw new HttpException(`Product not found! productId:${productId}`, HttpStatus.NOT_FOUND);
      }

      if (!productExists) {
        throw new HttpException(`Product not found! productId:${productId}`, HttpStatus.NOT_FOUND);
      }

      if (productExists.mediasProduct.length + dataBody.length > 5) {
        throw new HttpException(`Maximun 5 medias will have more than 5 medias with this add, already have ${productExists.mediasProduct.length} add at your product `, HttpStatus.BAD_REQUEST);
      }

      for await (const data of dataBody) {
        const mediaExists = await this.productMediaRepository.findOne({ where: { name: data.name } })

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

        const filePath = `classifields/users/${userId}/products/${productExists.id}/${data.name}`

        const url = await index.uploadBase64MediaToFirebaseStorage(data.base64, data.mimeType, filePath)

        if (!url) {
          throw new HttpException(`Media Product don't created there are some wrong in the bucket no returned url`, HttpStatus.BAD_REQUEST);
        } else {
          const media = new ProductMediaEntity()

          media.name = data.name
          media.mimeType = data.mimeType
          media.url = url.toString()
          media.product = productExists

          await this.productMediaRepository.save(media)
        }
      }

      return await this.productRepository.findOne({ where: { id: productId }, relations: ['mediasProduct'] })


    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        console.log(err, 'err')
        return err
      }
    }
  }

  async deleteMediasProduct(userId: number, productId: number, mediasId: number[]) {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId }, relations: ['mediaAvatar'] })

      if (!userExists) {
        throw new HttpException(`User not found! userId:${userId}`, HttpStatus.NOT_FOUND);
      }

      const productExists = await this.productRepository.findOne({ where: { id: productId }, relations: ['mediasProduct'] })

      if (!productExists) {
        throw new HttpException(`Product not found! productId:${productId}`, HttpStatus.NOT_FOUND);
      }

      for await (const id of mediasId) {

        const mediaExists = await productExists.mediasProduct.find(r => r.id === id)

        const filePath = `classifields/users/${userId}/products/${productExists.id}/${mediaExists.name}`

        const deletedBucket = await index.deleteMediaToFirebaseStorage(filePath)

        if (deletedBucket) {
          await this.productMediaRepository.delete(id)
        }

      }
      
      return true

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        console.log(err, 'err')
        return err
      }
    }
  }

  findAll() {
    return `This action returns all productMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productMedia`;
  }

  update(id: number, updateProductMediaDto: UpdateProductMediaDto) {
    return `This action updates a #${id} productMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} productMedia`;
  }
}
