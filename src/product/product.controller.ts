import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginatedProductDto } from './dto/paginated-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create Product User',
    description: `Create a product to user registred`,
    tags: ['product'],
  })
  @Post(':ownerUserId')
  create(@Param('ownerUserId') ownerUserId: number ,@Body() createProductDto: CreateProductDto) {
    return this.productService.create(ownerUserId,createProductDto);
  }

  //no guards because users that not did login will can see products
  @ApiOperation({
    summary: 'Get all Products',
    description: `Get all Products, return user list paginated`,
    tags: ['product'],
  })
  @ApiQuery({ name: 'query page', description: 'number page', required: false })
  @ApiQuery({ name: 'query take', description: 'total items returned per page', required: false })
  @Get()
  findAll(@Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }): Promise<PaginatedProductDto> {
    return this.productService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Receive param: product id ',
    description: `Get product by product id sended param`,
    tags: ['product'],
  })
  @Get(':productId')
  findOne(@Param('productId') productId: number):Promise<ProductEntity> {
    return this.productService.findOne(productId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Receive param: product id ',
    description: `Get product by product id sended param`,
    tags: ['product'],
  })
  @Get('getAllProductsByUserId/:ownerUserId')
  getAllProductsByUserId(@Param('ownerUserId') ownerUserId: number, @Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }):Promise<PaginatedProductDto> {
    return this.productService.getAllProductsByUserId(ownerUserId, query);
  } 

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'update by param : product id',
    description: `Update product data, that can to be modifications - update-product.dto.ts`,
    tags: ['product'],
  })
  @Patch(':productId')
  update(@Param('productId') productId: number, @Body() updateProductDto: CreateProductDto):Promise<ProductEntity>  {
    return this.productService.update(productId, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'remove user by param : owner User Id of product, product id',
    description: `remove product data`,
    tags: ['product'],
  })
  @Delete(':ownerUserId/:productId')
  remove(@Param('ownerUserId') ownerUserId: number, @Param('productId') productId: number,) {
    return this.productService.delete(ownerUserId, productId);
  }
  
}
