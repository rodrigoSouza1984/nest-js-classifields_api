import { Module, Global } from '@nestjs/common';
import { ProductMediaService } from './product-media.service';
import { ProductMediaController } from './product-media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMediaEntity } from './entities/product-media.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProductMediaEntity])],
  controllers: [ProductMediaController],
  exports: [TypeOrmModule, ProductMediaService],
  providers: [ProductMediaService]
})
export class ProductMediaModule {}






