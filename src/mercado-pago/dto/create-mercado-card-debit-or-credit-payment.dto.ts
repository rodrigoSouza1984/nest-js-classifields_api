import { ApiProperty } from "@nestjs/swagger"

//DOC PAYMENT DATA, TEM ALGUNS ATRIBUTOS QUE NAO COLOQUEI AKI TIPO COMISSAO ETC 
//https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post 

import { ItemsDto, Payer2Dto, PayerDto, ReceiverAddressDto } from "./objects-mercado-pago-used-in-payments.dto"

export class CreateMercadoPaymentCreditOrDebitDto {

    @ApiProperty({
        description: 'REQUIRED - object about adicional info of payment',
        example: 'additional_info : { items: ItemsDto[], payer?: PayerDto, shipments?: {receiver_address: ReceiverAddressDto} }',
    })
    additional_info: {
        items: ItemsDto[]                           
        payer: PayerDto                             
        shipments?: {                                
            receiver_address: ReceiverAddressDto    
        }
    }

    @ApiProperty({
        description: 'REQUIRED - description of payment',
        example: 'description: string',
    })
    description: string  
    
    @ApiProperty({
        description: 'REQUIRED - external_reference - we lets use userId that make purchase ',
        example: 'description: string',
    })
    external_reference: string  
    
    @ApiProperty({
        description: 'REQUIRED - number of times it was divided by the payer',
        example: 'installments: number ',
    })
    installments: number 
    
    @ApiProperty({
        description: 'REQUIRED - It is the identifier of the card issuer that is being used in a credit or debit card payment, i think that brics return it too with token',
        example: 'installments: number ',
    })
    issuer_id: string    
    
    @ApiProperty({
        description: 'OPTIONAL - This is an optional key-value object in qhich the customer can add additional information that needs to be recorded at payment {"payments_group_size":1,"payments_group_timestamp":"2022-11-18T15:01:44Z","payments_group_uuid":"96cfd2a4-0b06-4dea-b25f-c5accb02ba10"}',
        example: 'metadata : {"payments_group_size":1,"payments_group_timestamp":"2022-11-18T15:01:44Z","payments_group_uuid":"96cfd2a4-0b06-4dea-b25f-c5accb02ba10"} ',
    })
    metadata?: any  
    
    @ApiProperty({
        description: 'REQUIRED - about payer user ',
        example: 'payer: Payer2Dto',
    })
    payer: Payer2Dto   
    
    @ApiProperty({
        description: 'REQUIRED - type of payment credit_card, debit_card, bank_transfer, ticket ',
        example: 'payment_method_id: string',
    })
    payment_method_id: string 
    
    @ApiProperty({
        description: 'REQUIRED - token card get by front, with public key, this token is generate with owner information of card  ',
        example: 'token: string',
    })
    token: string     
    
    @ApiProperty({
        description: 'REQUIRED - quantity of payment ticket -> bankslip or lottery min 4 and 100000 obs: value not cents but 10.00 to $10,00',
        example: 'transaction_amount: 100',
    })
    transaction_amount: number  
    
    @ApiProperty({
        description: 'OPTIONAL - url to send message to notice create payment,in method cretated to receive message web hooks exemplo',
        example: 'notification_url?: string -> https://....',
    })
    notification_url?: string
}






