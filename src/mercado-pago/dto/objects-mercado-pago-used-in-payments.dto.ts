import { ApiProperty } from "@nestjs/swagger"

export class ItemsDto {
    @ApiProperty({
        description: 'REQUIRED - id of item -> we lets pass id of purshase, to after stay easy to get purchase',
        example: 'id: string',
    })
    id: string

    @ApiProperty({
        description: 'REQUIRED - title of purchase',
        example: 'title: string',
    })
    title: string

    @ApiProperty({
        description: 'REQUIRED - description of purchase',
        example: 'description: string',
    })
    description: string

    @ApiProperty({
        description: 'OPTIONAL - URL of image of purchase',
        example: 'picture_url: string -> https://.....',
    })
    picture_url?: string

    @ApiProperty({
        description: 'OPTIONAL - Category of purchase',
        example: 'category_id: string',
    })
    category_id?: string

    @ApiProperty({
        description: 'OPTIONAL - quantity of product. in cause de purchase',
        example: 'quantity: number',
    })
    quantity?: number

    @ApiProperty({
        description: 'OPTIONAL - price unit of product. in cause de purchase',
        example: 'unit_price: number',
    })
    unit_price?: number
}

export class PayerDto {
    @ApiProperty({
        description: 'REQUIRED - firts name of payer',
        example: 'first_name: string',
    })
    first_name: string

    @ApiProperty({
        description: 'REQUIRED - last name of payer',
        example: 'last_name: string',
    })
    last_name: string

    @ApiProperty({
        description: 'OPTIONAL - phone of payer',
        example: 'phone: {area_code: 11, number: 99999999}',
    })
    phone?: {
        area_code: number
        number: string
    }

    @ApiProperty({
        description: 'OPTIONAL - address of payer',
        example: 'address: AddressDto | {}',
    })
    address: AddressDto | {}
}

export class AddressDto {
    @ApiProperty({
        description: 'OPTIONAL - zip code of house payer',
        example: 'zip_code: string',
    })
    zip_code?: string

    @ApiProperty({
        description: 'OPTIONAL - street_name of house payer',
        example: 'street_name: string',
    })
    street_name?: string

    @ApiProperty({
        description: 'OPTIONAL - street_number of house payer',
        example: 'street_name: string',
    })
    street_number?: string
}

export class ReceiverAddressDto {
    @ApiProperty({
        description: 'OPTIONAL - zip code of house payer that receive product',
        example: 'zip_code: string',
    })
    zip_code?: string

    @ApiProperty({
        description: 'OPTIONAL - street_name of house payer that receive product',
        example: 'street_name: string',
    })
    state_name?: string

    @ApiProperty({
        description: 'OPTIONAL - city_name of house payer that receive product',
        example: 'city_name: string',
    })
    city_name?: string

    @ApiProperty({
        description: 'OPTIONAL - street_number of house payer that receive product',
        example: 'street_name: string',
    })
    street_name?: string

    @ApiProperty({
        description: 'OPTIONAL - street_number of house payer that receive product',
        example: 'street_number: string',
    })
    street_number?: number

    @ApiProperty({
        description: 'OPTIONAL - floor of house payer that receive product',
        example: 'floor: string',
    })
    floor?: string

    @ApiProperty({
        description: 'OPTIONAL - apartment of house payer that receive product',
        example: 'apartment: string',
    })
    apartment?: string
}

export class Payer2Dto {
    @ApiProperty({
        description: 'OPTIONAL - kind of payer entity only transfer bank. options =>  individual: Payer is individual. association: Payer is an association.',
        example: 'entity_type: string',
    })
    entity_type?: string

    @ApiProperty({
        description: 'OPTIONAL - kind of payer association only if need the payer is a client. options =>  customer: Payer is a Customer and belongs to the collector. guest: The payer doesn t have an account.',
        example: 'type: string',
    })
    type?: string    

    @ApiProperty({
        description: 'REQUIRED - email of payer',
        example: 'type: string',
    })
    email: string

    @ApiProperty({
        description: 'OPTIONAL - person identification of user',
        example: 'identification: IdentificationDto or {}',
    })
    identification?: IdentificationDto | {}
    
}

export class IdentificationDto {

    @ApiProperty({
        description: 'OPTIONAL - type of identification -> follow kinds CPF: Individual Taxpayer Registration, Brazil.  CNPJ: National Register of Legal Entities, Brazil.  CUIT: Unique Tax Identification Code, Argentina. CUIL: Unique Labor Identification Code, Argentina.  DNI: National Identity Document, Argentina. CURP: Single Population Registration Code, Mexico. RFC: Federal Registry of Taxpayers, Mexico.  CC: Citizenship Card, Colombia.  RUT: Single Tax List, Chile.  CI: Identity Card, Uruguay.',
        example: 'type: string',
    })
    type?: string

    @ApiProperty({
        description: 'OPTIONAL - numer of type choise, if will be CPF hava a 11 digits',
        example: 'number: string',
    })
    number?: string
}