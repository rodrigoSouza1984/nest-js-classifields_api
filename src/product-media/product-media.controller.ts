import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductMediaService } from './product-media.service';
import { CreateProductMediaDto } from './dto/create-media-product.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedProductMediaDto } from './dto/paginate-product-media.dto';
import { ProductMediaEntity } from './entities/product-media.entity';

@ApiTags('product-media')
@Controller('product-media')
export class ProductMediaController {
  constructor(private readonly productMediaService: ProductMediaService) {}

  @UseGuards(JwtAuthGuard)   
  @ApiOperation({
    summary: 'param will receive user id of product owner and product id too',
    description: `add media at the bucket and save data base media with your url`,              
    tags: ['product-media'],
  })
  @ApiBody({ type: CreateProductMediaDto }) 
  @Post('/:userId/:productId')
  addMediasProduct(@Param('userId') userId: number,@Param('productId') productId: number,@Body() dataBody: CreateProductMediaDto[]) {
    return this.productMediaService.addMediasProduct(userId,productId,dataBody);
  } 

  @UseGuards(JwtAuthGuard)  
  @ApiOperation({
    summary: 'Get all Medias Products',
    description: `Get all Medias Products, return user list paginated`,
    tags: ['product-media'],
  })
  @ApiQuery({ name: 'query page', description: 'number page', required: false })
  @ApiQuery({ name: 'query take', description: 'total items returned per page', required: false })
  @Get()
  getAllMediasProducts(@Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }): Promise<PaginatedProductMediaDto> {
    return this.productMediaService.getAllMediasProducts(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Receive param: product id ',
    description: `Get product by product id sended param`,
    tags: ['product-media'],
  })
  @Get(':mediaId')
  getOneByMediaId(@Param('mediaId') mediaId: number):Promise<ProductMediaEntity> {
    return this.productMediaService.getOneByMediaId(mediaId);
  }

  @UseGuards(JwtAuthGuard)   
  @ApiOperation({
    summary: 'param will receive user id product owner and file name media',
    description: `remove media data of data base, and remove in the STORAGE too media uploaded`,
    tags: ['product-media'],
  })
  @Delete('/:userId/:productId')
  deleteMediasProduct(@Param('userId') userId: number,@Param('productId') productId: number,@Body() mediasId: number[]) {
    return this.productMediaService.deleteMediasProduct(userId,productId,mediasId);
  }
  
}
