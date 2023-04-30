import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from './create-user.dto';
import { TypePermissionEnum } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty({
        description: 'real name of people that is subscribe',
        example: 'José da Silva'
    })
    realName?: string;
    
    @ApiProperty({
        description: 'type permission that user have, enum [admin, user], default is user',
        example: 'admin'
    })
    typePermissionEnum?: TypePermissionEnum;
}
