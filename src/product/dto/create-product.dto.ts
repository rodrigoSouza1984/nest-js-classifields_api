import { User } from "src/user/entities/user.entity";
import { TypeProductEnum } from "../entities/product.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ProductMediaEntity } from "src/product-media/entities/product-media.entity";

export class CreateProductDto {

    @ApiProperty({
        description: 'REQUIRED - real name of people that is subscribe',
        example: 'José da Silva',       
    })
    ownerRealName?: string;    

    @ApiProperty({
        description: 'REQUIRED - name that peolple want user in aplication, but this name have to be unique',
        example: 'JoseSilva'
    })   
    ownerEmail?: string;

    @ApiProperty({
        description: 'REQUIRED - cantact phone',
        example: '0xx-9xxxx-xxxx'
    })  
    ownerContactPhone?: string;

    @ApiProperty({
        description: 'REQUIRED - Title to your announcement ',
        example: 'My Farm'
    })  
    title?: string;

    @ApiProperty({
        description: 'REQUIRED - All descriptions of your announcement ',
        example: '2 rooms, 2 bathrooms, pool ....'
    }) 
    description?: string;

    @ApiProperty({
        description: 'REQUIRED "dailyValue or valuePerMonth" - Price daily your announcement, value sended at cents',
        example: 'R$100,00 ....'
    }) 
    dailyValue?: number;   

    @ApiProperty({
        description: 'REQUIRED "dailyValue or valuePerMonth" - Price per month your announcement, value sended at cents',
        example: 'R$1000,00 ....'
    })
    valuePerMonth?: number;

    @ApiProperty({
        description: 'REQUIRED - Street local where your announcement stay localizaded',
        example: 'Street: aabb....'
    }) 
    street?: string;    

    @ApiProperty({
        description: 'REQUIRED - Neighborhood that your announcement stay',
        example: 'XXXX....'
    }) 
    neighborhood?: string;

    @ApiProperty({
        description: 'REQUIRED - Complement about your neighborhood or street etc, that your announcement stay on the street',
        example: 'Bloc xx Apartment x....'
    }) 
    complement?: string;

    @ApiProperty({
        description: 'REQUIRED - Number that your announcement stay on the street  ',
        example: '122'
    }) 
    number?: number;  

    @ApiProperty({
        description: 'REQUIRED - City of your announcement stay',
        example: 'xxxxxx....'
    }) 
    city?: string;

    @ApiProperty({
        description: 'REQUIRED - State of your announcement stay',
        example: 'xx....'
    }) 
    state?: string;
    
    @ApiProperty({
        description: 'REQUIRED  - Postal code your announcement',
        example: 'xxxxx-xxx'
    })
    postalCode?: string; 

    @ApiProperty({
        description: 'REQUIRED - Kind product of announcement - enum = [ farm, partyHall, house, apartment ]',
        example: 'xx-xxx-xxx'
    })
    typeProductEnum?: TypeProductEnum;

    @ApiProperty({
        description: 'REQUIRED - Medias about your product minimum 1 maximum 5]',
        example: 'mediasProduct: [{create-product-media.dto}]'
    })
    mediasProduct?: ProductMediaEntity[]

    @ApiProperty({
        description: 'REQUIRED - User owner of announcement, send by param this property ',
        example: '{url}/xxxx/userId'
    })
    user?: User;
}
