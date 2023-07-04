import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserForgetPasswordDto extends PartialType(CreateUserDto) {    

    @ApiProperty({
        description: 'user email, email subscribe of user, must to be same email',
        example: 'JoseSilva@email.com'
    })
    email?:string  
        
    qtdTryingSendEmail?:number   
}