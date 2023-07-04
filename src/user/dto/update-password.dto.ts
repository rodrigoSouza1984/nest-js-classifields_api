import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {    
    @ApiProperty({
        description: 'REQUIRED - Password that user its using.',
        example: 'a/123457890',        
        minimum: null,
        maximum: null,
        default: '',
    })
    password?: string;
    
    @ApiProperty({
        description: 'REQUIRED - Confirm Password that user its using.',
        example: 'a/123457890'
    })
    confirmPassword?: string;    
    
    @ApiProperty({
        description: 'REQUIRED - New Password to update.',
        example: '1/abcdefghij'
    })
    newPassword?: string; 
    
    @ApiProperty({
        description: 'REQUIRED - Confirm New Password to update.',
        example: '1/abcdefghij'
    })
    confirmNewPassword?: string;    
       
}