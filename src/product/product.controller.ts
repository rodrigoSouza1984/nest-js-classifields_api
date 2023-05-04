import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':ownerUserId')
  create(@Param('ownerUserId') ownerUserId: number ,@Body() createProductDto: CreateProductDto) {
    return this.productService.create(ownerUserId,createProductDto);
  }

  @Delete(':ownerUserId/:productId')
  remove(@Param('ownerUserId') ownerUserId: number, @Param('productId') productId: number,) {
    return this.productService.delete(ownerUserId, productId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  
}
