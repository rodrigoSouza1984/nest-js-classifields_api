import { User } from "src/user/entities/user.entity";
import { TypeProductEnum } from "../entities/product.entity";
import { ApiProperty } from "@nestjs/swagger";

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
        description: 'REQUIRED - Price daily your announcement',
        example: 'R$100,00 ....'
    }) 
    dailyValue?: string;

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
        description: 'NO REQUIRED - Complement about your neighborhood or street etc, that your announcement stay on the street',
        example: 'Bloc xx Apartment x....'
    }) 
    complement?: string;

    @ApiProperty({
        description: 'NO REQUIRED - Number that your announcement stay on the street  ',
        example: '122'
    }) 
    number?: number;  
    
    @ApiProperty({
        description: 'REQUIRED  - Postal code your announcement',
        example: 'xx-xxx-xxx'
    })
    postalCode?: number; 

    @ApiProperty({
        description: 'REQUIRED - Kind product of announcement - enum = [farm, partyHall]',
        example: 'xx-xxx-xxx'
    })
    typeProductEnum?: TypeProductEnum;

    @ApiProperty({
        description: 'REQUIRED - User owner of announcement, send by param this property ',
        example: '{url}/xxxx/userId'
    })
    user?: User;

}
