//DOC PAYMENT DATA, TEM ALGUNS ATRIBUTOS QUE NAO COLOQUEI AKI TIPO COMISSAO ETC 
//https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post 

export class CreateMercadoPaymentDto {
    additional_info: {
        items: ItemsDto[]                           //items list purchase in buy
        payer: PayerDto                             //OBRIGATÓRIO - O payer é aquele que faz o pagamento. Este campo é um objeto que possui as informações do pagador.
        shipments: {                                //Objeto que compreende todas as informações para o envio da compra do cliente.
            receiver_address: ReceiverAddressDto    //Objeto que compreende o endereço do destinatário da compra.
        }
    }
    description: string                             //OBRIGATÓRIO - Descrição do produto comprado, a razão de pagamento. Por exemplo - "Celular Xiaomi Redmi Note 11S 128gb 6gb Ram Versão Global Original azul" (descrição de um produto no marketplace).
    external_reference: string                      //tipo o id do usuario que compra - É uma referência externa do pagamento. Pode ser, por exemplo, um hashcode do Banco Central, funcionando como identificador de origem da transação.
    installments: number                            //Número de parcelas selecionado
    issuer_id: string                               //OBRIGATÓRIO - PEGA NO TOKEN DO CARTAO OBJETO DO FRONT TB - É o identificador do emissor do cartão que está sendo utilizado em um pagamento com cartão de crédito ou débito.
    metadata: MetadataDto                           //Este é um objeto opcional do tipo chave-valor no qual o cliente pode adicionar informações adicionais que precisam ser registradas no pagamento. Ex - {"payments_group_size":1,"payments_group_timestamp":"2022-11-18T15:01:44Z","payments_group_uuid":"96cfd2a4-0b06-4dea-b25f-c5accb02ba10"}
    payer: Payer2Dto                                ////OBRIGATÓRIO - O payer é aquele que faz o pagamento. Este campo é um objeto que possui as informações do pagador.
    payment_method_id: string                       //OBRIGATÓRIO - PEGO NO FRONT COMO TOKEN Indica o identificador do meio de pagamento selecionado para efetuar o pagamento. A seguir, apresentamos alguns exemplos.
    token: string                                   //OBRIGATÓRIO - criado pelo front o token do cartao - Identificador de token card (obrigatório para cartão de crédito). O token do cartão é criado a partir das próprias informações do cartão, aumentando a segurança durante o fluxo do pagamento. Além disso, uma vez que o token é utilizado em determinada compra, ele é descartado, sendo necessária a criação de um novo token para compras futuras.
    transaction_amount: number                      //OBRIGATÓRIO - Custo do produto. Exemplo - A venda de um produto por R$100,00 terá um transactionAmount = 100.
}

export class ItemsDto {                             //items list purchase in buy
    id: string                                      //É o identificador do anúncio do produto comprado. Por exemplo - “MLB2907679857” 
    title: string                                   //Nome do item
    description: string                             //Descrição do artigo
    picture_url: string                             //URL da imagem
    category_id: string                             //É a categoria do item que foi comprado. É possível citar duas formas principais de category_id - as categorias inseridas por meio de um código, como “MLB189908”, ou as que são uma tag, como “phone”.
    quantity: number                                //Quantidade do produto
    unit_price: number                              //Preço unitário do item comprado.
}

export class PayerDto {                             //OBRIGATÓRIO - O payer é aquele que faz o pagamento. Este campo é um objeto que possui as informações do pagador.
    first_name: string                              //Nome do comprador
    last_name: string                               //É o campo do sobrenome do comprador.
    phone: {                                        //Telefone do comprador
        area_code: number                           //Código de área onde reside o comprador.
        number: string                              //Número de telefone do comprador.
    }
    address: AddressDto | {}                        //Endereço do comprador. - mandei assim pela doc "address": {}
}

export class AddressDto {                           //Endereço do comprador. 
    zip_code: string                                //Código postal do comprador.
    street_name: string                             //Rua onde mora o comprador.
    street_number: string                           //Número do imóvel onde mora o comprador.
}

export class ReceiverAddressDto {                   //Objeto que compreende o endereço do destinatário da compra.
    zip_code?: string                               //Código postal
    state_name?: string                             //Província
    city_name?: string                              //Cidade
    street_name?: string                            //Rua
    street_number?: number                          //Número
    floor?: string                                  //Andar do endereço de entrega.
    apartment?: string                              //Número do apartamento do endereço de entrega.
}

export class MetadataDto { }                        //Este é um objeto opcional do tipo chave-valor no qual o cliente pode adicionar informações adicionais que precisam ser registradas no pagamento. Ex - {"payments_group_size":1,"payments_group_timestamp":"2022-11-18T15:01:44Z","payments_group_uuid":"96cfd2a4-0b06-4dea-b25f-c5accb02ba10"}

export class Payer2Dto {
    entity_type: string                             //Tipo de entidade do pagador (apenas para transferências bancárias) individual: Payer is individual. association: Payer is an association.
    type: string                                    //Tipo de identificação do pagador associado (se necessário o pagador é um cliente)    customer: Payer is a Customer and belongs to the collector.    registered: The account corresponds to a Mercado Pago registered user.    guest: The payer doesn't have an account.
    email: string                                   //OBRIGATÓRIO - E-mail do comprador
    identification: IdentificationDto | {}
}

export class IdentificationDto {
    type: string                                    //Refere-se ao tipo de identificação. Pode ser dos seguintes tipos.    CPF: Individual Taxpayer Registration, Brazil.    CNPJ: National Register of Legal Entities, Brazil. tem mais paises na doc do mercadopago     
    number: string                                  //O número se refere ao identificador do usuário em questão. Se for um CPF, por exemplo, terá 11 números.
}
