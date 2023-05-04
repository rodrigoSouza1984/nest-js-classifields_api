import { Module, Global } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMediaEntity } from 'src/product-media/entities/product-media.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductMediaEntity])],
  controllers: [ProductController],
  exports: [TypeOrmModule, ProductService],
  providers: [ProductService]
})
export class ProductModule {}





