import { CreateProductMediaDto } from "./create-media-product.dto";


export class PaginatedProductMediaDto {
    total: number;    
    mediasProducts: CreateProductMediaDto[];
}