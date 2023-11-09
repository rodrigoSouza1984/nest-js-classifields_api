import { ApiProperty } from "@nestjs/swagger"

export class UpdateMercadoPagoDto {

    @ApiProperty({
        description: 'OPTIONAL - It is a Boolean field that exists in two-step payments (such as debit cards). In this type of payment, which is carried out asynchronously, the purchase amount is first reserved (capture = false). This amount is captured and is not debited from the account instantly. When the money is actually transferred to the collector (who receives the payment) the amount is captured (capture = true).',
        example: 'capture: boolean',
    })
    capture?: boolean

    @ApiProperty({
        description: `OPTIONAL - Payment expiration date. The valid attribute format is as follows - "yyyy-MM-dd'T'HH:mm:ssz". For example - 2022-11-17T09:37:52.000-04:00.`,
        example: 'date_of_expiration: 2022-11-17T09:37:52.000-04:00',
    })
    date_of_expiration?: string

    @ApiProperty({
        description: `OPTIONAL - this is status payment. pending, approved, authorized, in_process, in_mediation, rejected, cancelled, refunded or charged_back`,
        example: 'status: string',
    })
    status?: string

    @ApiProperty({
        description: 'OPTIONAL - quantity of payment ticket -> bankslip or lottery min 4 and 100000 obs: value not cents but 10.00 to $10,00',
        example: 'transaction_amount: 100',
    })
    transaction_amount?: number
}
