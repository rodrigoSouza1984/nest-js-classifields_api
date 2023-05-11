import { PartialType } from '@nestjs/swagger';
import { CreateProductMediaDto } from './create-media-product.dto';

export class UpdateProductMediaDto extends PartialType(CreateProductMediaDto) {}
