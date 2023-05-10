import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

      if (createProductDto.title === '' || createProductDto.title === undefined ||
        createProductDto.ownerRealName === '' || createProductDto.ownerRealName === undefined ||
        createProductDto.ownerEmail === '' || createProductDto.ownerEmail === undefined ||
        createProductDto.ownerContactPhone === '' || createProductDto.ownerContactPhone === undefined ||
        createProductDto.description === '' || createProductDto.description === undefined ||
        createProductDto.typeProductEnum === null || createProductDto.typeProductEnum === undefined ||
        createProductDto.street === '' || createProductDto.street === undefined ||
        createProductDto.neighborhood === '' || createProductDto.neighborhood === undefined ||
        createProductDto.postalCode === null || createProductDto.neighborhood === undefined ||
        createProductDto.number === null || createProductDto.number === undefined ||
        createProductDto.city === '' || createProductDto.city === undefined ||
        createProductDto.state === '' || createProductDto.state === undefined
      ) {
        throw new HttpException(`Title, ownerRealName, ownerEmail, ownerContactPhone,
        dailyValue, description, typeProductEnum, street, neighborhood, postalCode, 
        city, state number must be sended!`, HttpStatus.BAD_REQUEST);
      }

      let dailyValueEmpty = false
      let valuePerMonthEmpty = false

      if (createProductDto.dailyValue === null || createProductDto.dailyValue === undefined) {
        dailyValueEmpty = true
      }

      if (createProductDto.valuePerMonth === null || createProductDto.valuePerMonth === undefined) {
        valuePerMonthEmpty = true
      }

      if (dailyValueEmpty === true && valuePerMonthEmpty === true) {
        throw new HttpException(`daily value or value per month must be sended!`, HttpStatus.BAD_REQUEST);
      }

      const regexCepTest = /^(\d{5})-?(\d{3})$/

      if (regexCepTest.test(createProductDto.postalCode) === false) {
        throw new HttpException(`Postal code invalid!`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.userRepository.findOne({ where: { id: ownerUserId } })

      if (!userExists) {
        throw new HttpException(`User don't found!`, HttpStatus.NOT_FOUND);
      }

      if (userExists.email !== createProductDto.ownerEmail) {
        throw new HttpException(`Email sended must be the same of register user!`, HttpStatus.BAD_REQUEST);
      }

      if (userExists.realName !== createProductDto.ownerRealName) {
        throw new HttpException(`Real name sended must be the same of register user!`, HttpStatus.BAD_REQUEST);
      }

      const product = new ProductEntity()

      product.ownerRealName = createProductDto.ownerRealName
      product.ownerEmailContact = createProductDto.ownerEmail
      product.ownerContactPhone = createProductDto.ownerContactPhone
      product.title = createProductDto.title
      product.description = createProductDto.description
      product.dailyValue = createProductDto.dailyValue
      product.typeProductEnum = createProductDto.typeProductEnum
      product.street = createProductDto.street
      product.neighborhood = createProductDto.neighborhood
      product.complement = createProductDto.complement
      product.number = createProductDto.number
      product.city = createProductDto.city
      product.state = createProductDto.state
      product.postalCode = createProductDto.postalCode
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
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw err
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
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw err
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
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw err
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
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw err
      }
    }
  }

  async update(productId: number, updateProductDto: UpdateProductDto):Promise<ProductEntity> {
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
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw err
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
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw err
      }
    }
  }

  
}
