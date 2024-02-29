import { User } from "src/user/entities/user.entity";
import { NeighborhoodTypeEnum, TypeProductEnum } from "../entities/product.entity";
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
    ownerEmailContact?: string;

    @ApiProperty({
        description: 'OPTIONAL - cantact phone',
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
    descriptionPlace?: string;    

    @ApiProperty({
        description: 'OPTIONAL - Street local where your announcement stay localizaded, default = "sem Rua"',
        example: 'Street: aabb....'
    }) 
    street?: string;    

    @ApiProperty({
        description: 'OPTIONAL - Neighborhood that your announcement stay, default = "sem Bairro"',
        example: 'XXXX....'
    }) 
    neighborhood?: string;

    @ApiProperty({
        description: 'OPTIONAL - Complement about your neighborhood or street etc, that your announcement stay on the street',
        example: 'Bloc xx Apartment x....'
    }) 
    complement?: string;

    @ApiProperty({
        description: 'REQUIRED - City of your announcement stay',
        example: 'São Paulo'
    }) 
    city?: string;

    @ApiProperty({
        description: 'REQUIRED - State of your announcement stay',
        example: 'SP'
    }) 
    state?: string; 

    @ApiProperty({
        description: 'OPTIONAL - Number that your announcement stay on the street, default = "sem numero"  ',
        example: '122'
    }) 
    number?: string;
    
    @ApiProperty({
        description: 'REQUIRED  - Postal code your announcement',
        example: 'xxxxx-xxx'
    })
    postalCode?: string; 
    
    @ApiProperty({
        description: 'REQUIRED - price of product',
        example: '100.00'
    })
    price?: number; 

    @ApiProperty({
        description: 'OPTIONAL - discount of product in your final price',
        example: '100.00'
    })
    discountItem?: number;

    @ApiProperty({
        description: 'REQUIRED - description about price, can be by mounth or by day or more options',
        example: '100.00 by day'
    })
    descriptionPrice?: string;
        
    @ApiProperty({
        description: 'OPTIONAL - place name of place',
        example: 'maria salom'
    })
    placeName?: string;

    @ApiProperty({
        description: 'OPTIONAL - explain form of arrived local',
        example: `Near maria's Mercad`
    })
    routePlace?: string;

    @ApiProperty({
        description: 'REQUIRED - Kind product of announcement - enum = [ farm, partyHall, house, apartment ]',
        example: 'partyHall'
    })
    typeProductEnum?: TypeProductEnum;

    @ApiProperty({
        description: 'REQUIRED - Kind neighborhood local of announcement - enum = [ urban, rural]',
        example: 'rural'
    })
    neighborhoodTypeEnum?: NeighborhoodTypeEnum; 
    
    @ApiProperty({
        description: 'REQUIRED - User owner of announcement, send by param this property ',
        example: '{url}/xxxx/userId'
    })
    user?: User;

    @ApiProperty({
        description: 'REQUIRED - Medias about your product minimum 1 maximum 5]',
        example: 'mediasProduct: [{create-product-media.dto}]'
    })
    mediasProduct?: ProductMediaEntity[]

    

}
