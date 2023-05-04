import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductMediaService } from './product-media.service';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';

@Controller('product-media')
export class ProductMediaController {
  constructor(private readonly productMediaService: ProductMediaService) {}

  @Post('/:userId/:productId')
  addMediasProduct(@Param('userId') userId: number,@Param('productId') productId: number,@Body() dataBody: CreateProductMediaDto[]) {
    return this.productMediaService.addMediasProduct(userId,productId,dataBody);
  }
  
  @Delete('/:userId/:productId')
  deleteMediasProduct(@Param('userId') userId: number,@Param('productId') productId: number,@Body() mediasId: number[]) {
    return this.productMediaService.deleteMediasProduct(userId,productId,mediasId);
  }

  @Get()
  findAll() {
    return this.productMediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productMediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductMediaDto: UpdateProductMediaDto) {
    return this.productMediaService.update(+id, updateProductMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productMediaService.remove(+id);
  }
}
