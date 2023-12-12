import { User } from "src/user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger"

export class CreateFirebaseDeviceRegisterDto {  
    
    @ApiProperty({
        description: 'REQUIRED - user id add token in data base',
        example: `userId: number` ,
    })
    userId?: number;    

    @ApiProperty({
        description: 'REQUIRED - token add in data base',
        example: `token: string` ,
    })
    token?: string;
    
    user?: User;
}