import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty({
        description: 'real name of people that is subscribe',
        example: 'José da Silva'
    })
    realName?: string;    
}
