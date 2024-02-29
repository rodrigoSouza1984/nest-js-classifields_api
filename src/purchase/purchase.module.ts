import { Global, Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseEntity } from './entities/purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseItemEntity } from './entities/pruchase-item.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity, PurchaseItemEntity])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [TypeOrmModule, PurchaseService],
})
export class PurchaseModule {}




