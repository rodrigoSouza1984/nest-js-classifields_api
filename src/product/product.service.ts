import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProductMediaService } from 'src/product-media/product-media.service';
import { PaginatedProductDto } from './dto/paginated-product.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private productMediaService: ProductMediaService
  ) { }

  async create(ownerUserId: number, createProductDto: CreateProductDto) {
    try {

      if (!createProductDto.mediasProduct) {
        throw new HttpException(`Medias array have be sended`, HttpStatus.BAD_REQUEST);
      }

      if (createProductDto.mediasProduct.length < 1) {
        throw new HttpException(`Minimun 1 media about your product!`, HttpStatus.BAD_REQUEST);
      }

      if (createProductDto.mediasProduct.length > 5) {
        throw new HttpException(`Maximum 5 media about your product!`, HttpStatus.BAD_REQUEST);
      }

      if (createProductDto.ownerRealName === '' || createProductDto.ownerRealName === undefined ||
        createProductDto.ownerEmailContact === '' || createProductDto.ownerEmailContact === undefined || 
        createProductDto.title === '' || createProductDto.title === undefined ||      
        createProductDto.descriptionPlace === '' || createProductDto.descriptionPlace === undefined ||              
        createProductDto.city === '' || createProductDto.city === undefined ||
        createProductDto.state === '' || createProductDto.state === undefined ||
        createProductDto.postalCode === null || createProductDto.postalCode === undefined ||
        createProductDto.price === null || createProductDto.price === undefined ||
        createProductDto.descriptionPrice === null || createProductDto.descriptionPrice === undefined ||
        createProductDto.typeProductEnum === null || createProductDto.typeProductEnum === undefined ||  
        createProductDto.neighborhoodTypeEnum === null || createProductDto.neighborhoodTypeEnum === undefined
      ) {
        throw new HttpException(`ownerRealName, ownerEmail, title,
        descriptionPlace, typeProductEnum, postalCode, city, state, price, 
        descriptionPrice, neighborhoodTypeEnum must be sended!`, HttpStatus.BAD_REQUEST);
      }      

      const regexCepTest = /^(\d{5})-?(\d{3})$/

      if (regexCepTest.test(createProductDto.postalCode) === false) {
        throw new HttpException(`Postal code invalid!`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.userRepository.findOne({ where: { id: ownerUserId } })

      if (!userExists) {
        throw new HttpException(`User don't found!`, HttpStatus.NOT_FOUND);
      }

      if (userExists.email !== createProductDto.ownerEmailContact) {
        throw new HttpException(`Email sended must be the same of register user!`, HttpStatus.BAD_REQUEST);
      }

      if (userExists.realName !== createProductDto.ownerRealName) {
        throw new HttpException(`Real name sended must be the same of register user!`, HttpStatus.BAD_REQUEST);
      }

      const product = new ProductEntity()

      product.ownerRealName = createProductDto.ownerRealName
      product.ownerEmailContact = createProductDto.ownerEmailContact
      product.ownerContactPhone = createProductDto.ownerContactPhone
      product.title = createProductDto.title
      product.descriptionPlace = createProductDto.descriptionPlace 
      product.street = createProductDto.street
      product.neighborhood = createProductDto.neighborhood
      product.complement = createProductDto.complement
      product.city = createProductDto.city
      product.state = createProductDto.state
      product.number = createProductDto.number
      product.postalCode = createProductDto.postalCode
      product.price = createProductDto.price
      product.descriptionPrice = createProductDto.descriptionPrice      
      product.placeName = createProductDto.placeName
      product.routePlace = createProductDto.routePlace           
      product.typeProductEnum = createProductDto.typeProductEnum
      product.neighborhoodTypeEnum = createProductDto.neighborhoodTypeEnum      
      product.user = userExists

      const productCreated = await this.productRepository.save(product)

      if (productCreated) {
        const mediasAdds = await this.productMediaService.addMediasProduct(userExists.id, productCreated.id, createProductDto.mediasProduct)

        if (mediasAdds) {
          return await this.productRepository.findOne({ where: { id: productCreated.id }, relations: ['mediasProduct'] })
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

  async findAll(query: { page: number; take: number; orderBy: 'ASC' | 'DESC'; }): Promise<PaginatedProductDto> {
    try {
      let { page, take, orderBy } = query;

      if (!page) page = 1;
      if (!take) take = 10;
      if (!orderBy) orderBy = 'DESC';

      const [products, total] = await this.productRepository.findAndCount({
        relations: ['mediasProduct'],
        skip: take * (page - 1),
        take,
        order: { id: orderBy },
      })

      return { total, products: products };

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

  async findOne(productId: number):Promise<ProductEntity> {
    try {
      const productExists = await this.productRepository.findOne({ where: { id: productId }, relations: ['mediasProduct'] });

      if (!productExists) {
        throw new HttpException(`User id:${productId} don't found`, HttpStatus.BAD_REQUEST);
      }

      return productExists

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

  async getAllProductsByUserId(ownerUserId: number, query: { page: number; take: number; orderBy: 'ASC' | 'DESC'; }):Promise<PaginatedProductDto> {
    try {
      let { page, take, orderBy } = query;

      if (!page) page = 1;
      if (!take) take = 10;
      if (!orderBy) orderBy = 'DESC';

      const userExists = await this.userRepository.findOne({ where: { id: ownerUserId }, relations: ['mediaAvatar'] });

      if (!userExists) {
        throw new HttpException(`User id:${ownerUserId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const [products, total] = await this.productRepository.findAndCount({
        where:{ownerEmailContact: userExists.email},
        relations: ['mediasProduct'],
        skip: take * (page - 1),
        take,
        order: { id: orderBy },
      })

      return { total, products: products };

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

  async update(productId: number, updateProductDto: CreateProductDto):Promise<ProductEntity> {
    try {
      const productExists = await this.productRepository.findOne({ where: { id: productId } });

      if (!productExists) {
        throw new HttpException(`User id:${productId} don't found`, HttpStatus.BAD_REQUEST);
      }

      await this.productRepository.save({
        ...updateProductDto,
        id: Number(productId),
      }); 
      
      return await this.findOne(productId)

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

  async delete(ownerUserId: number, productId: number) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: ownerUserId } })

      if (!userExists) {
        throw new HttpException(`User id:${ownerUserId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const productExists = await this.productRepository.findOne({ where: { id: productId }, relations: ['mediasProduct'] })

      if (!productExists) {
        throw new HttpException(`Product not found! productId:${productId}`, HttpStatus.NOT_FOUND);
      }

      let mediaIds = []

      for await (const media of productExists.mediasProduct) {
        mediaIds.push(media.id)
      }      

      const mediasDeleteds = await this.productMediaService.deleteMediasProduct(userExists.id, productExists.id, mediaIds)

      if(mediasDeleteds){
        return await this.productRepository.delete(productExists.id)
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
