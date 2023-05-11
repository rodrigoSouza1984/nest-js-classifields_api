import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "src/product/entities/product.entity";

export class CreateProductMediaDto {
    @ApiProperty({
        description: 'REQUIRED - name image sended, this name can to be unique',
        example: 'timestamp of moment date',        
    })
    name?: string;

    @ApiProperty({
        description: 'REQUIRED - type image sended',
        example: 'image/jpeg',        
    })
    mimeType?: string;

    url?: string;

    @ApiProperty({
        description: 'REQUIRED - content base64 image sended',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZ.....',        
    })
    base64?: string 

    product: ProductEntity; 
}
