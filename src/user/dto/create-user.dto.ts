import { ApiProperty } from "@nestjs/swagger";
import { UserMediaAvatarEntity } from "../../user-media-avatar/entities/media-avatar.entity";
import { TypePermissionEnum } from "../entities/user.entity";

export class CreateUserDto {    
    @ApiProperty({
        description: 'REQUIRED - real name of people that is subscribe',
        example: 'José da Silva',        
        minimum: null,
        maximum: null,
        default: '',
    })
    realName?: string;
    
    @ApiProperty({
        description: 'REQUIRED - name that peolple want user in aplication, but this name have to be unique',
        example: 'JoseSilva'
    })
    userName?: string;    
    
    @ApiProperty({
        description: 'REQUIRED - user email, but this email have to be unique',
        example: 'JoseSilva@email.com'
    })
    email?: string; 
    
    @ApiProperty({
        description: 'REQUIRED - password of user, its must have minimun 8 caracteres',
        example: 'josesil2'
    })
    password?: string;   
    
    @ApiProperty({
        description: 'REQUIRED - password of user, its must have minimun 8 caracteres, must to be equal password',
        example: 'josesil2'
    })
    confirmPassword?: string; 

    @ApiProperty({
        description: `REQUIRED - user's date of birth`,
        example: '01/01/1950'
    })
    dateOfBirth: string;

    emailCode?: number;

    @ApiProperty({
        description: 'type permission that user have, enum [admin, user], default is user',
        example: 'admin'
    })
    typePermissionEnum?: TypePermissionEnum;
    
    @ApiProperty({
        description: `NO REQUIRED ENTITY RELATION ONE TO ONE WITH USER , ITS IMAGE AVATAR OF USER `,
        type: Object,
        example: 'OBJECT MediaAvatarDto',
    })
    mediaAvatar?: UserMediaAvatarEntity;    
}
