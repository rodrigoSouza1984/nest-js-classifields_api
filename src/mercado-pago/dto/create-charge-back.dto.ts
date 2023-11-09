import { ApiProperty } from "@nestjs/swagger"

export class CreateChargeBackDto{   
    
    @ApiProperty({
        description: 'OPTIONAL - Refund amount. If the property (amount) is removed from the body, it will create a full refund.',
        example: 'amount: 100',
    })
    amount?: number
}