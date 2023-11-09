import { ApiProperty } from "@nestjs/swagger"


export class createMercadoPagoPixDto {

    @ApiProperty({
        description: 'REQUIRED - quantity of payment ticket -> bankslip or lottery min 4 and 100000 obs: value not cents but 10.00 to $10,00',
        example: 'transaction_amount: 100',
    })
    transaction_amount: number

    @ApiProperty({
        description: 'REQUIRED - type of payment credit_card, debit_card, bank_transfer, ticket ',
        example: 'payment_method_id: string',
    })
    payment_method_id: string

    @ApiProperty({
        description: 'REQUIRED - pix need ony email of payer',
        example: 'payer: {email: string}',
    })
    payer: {        
        email: string
    }
}