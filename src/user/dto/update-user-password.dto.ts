import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserPasswordDto extends PartialType(CreateUserDto) {

    @ApiProperty({
        description: 'password of user, its must have minimun 8 caracteres, cause come here in body its understand that update password, cause don t come here in body its understand to be a forget passoword ',
        example: 'josesil2'
    })
    password?: string;

    @ApiProperty({
        description: 'user email, email subscribe of user, must to be same email',
        example: 'JoseSilva@email.com'
    })
    email?:string  

    
    qtdTryingSendEmail?:number    
}