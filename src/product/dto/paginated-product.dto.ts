import { CreateProductDto } from "./create-product.dto";

export class PaginatedProductDto {
    total: number;    
    products: CreateProductDto[];
}