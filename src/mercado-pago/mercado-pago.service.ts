import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMercadoPaymentCreditOrDebitDto } from './dto/create-mercado-card-debit-or-credit-payment.dto';
import { UpdateMercadoPagoDto } from './dto/update-mercado-pago.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChargeBackDto } from './dto/create-charge-back.dto';
import { CreateMercadoPaymentBankSlipOrLotteryDto } from './dto/create-mercado-pago-bankslip-and-lottery-payment';
import { createMercadoPagoPixDto } from './dto/create-mercado-pago-pix.dto';

@Injectable()
export class MercadoPagoService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private httpService: HttpService
  ) { }

  // cartao teste => https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/additional-content/your-integrations/test/cards  
  //link doc mercado livre => https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post  

  async createPaymentCreditOrDebit(createMercadoPaymentCreditOrDebitDto: CreateMercadoPaymentCreditOrDebitDto) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
        //'X-Idempotency-Key:': `NÃO é OBRIGADO AINDA MAIS QUANDO TIVE ENVIAR UM UUID OU STRING ALEATORIA`
      };

      const createPost = await lastValueFrom(
        this.httpService.post('https://api.mercadopago.com/v1/payments', createMercadoPaymentCreditOrDebitDto,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      ).catch(err => {
        console.log(err.config.response, 9999);
        throw err
      }
      )

      return createPost

    } catch (err) {
      if (err.driverError) {
        console.log(err.response.data)
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          console.log(err.response.data)
          throw err
        } else if (err.message) {
          console.log(err.response.data)
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          console.log(err.response.data)
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async createPaymentBankSlipOrLoterica(createMercadoPaymentBankSlipOrLotteryDto: CreateMercadoPaymentBankSlipOrLotteryDto) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_PRODUCAO_MERCADOPAGO}`,
        //'X-Idempotency-Key:': `NÃO é OBRIGADO AINDA MAIS QUANDO TIVE ENVIAR UM UUID OU STRING ALEATORIA`
      };

      const createPost = await lastValueFrom(
        this.httpService.post('https://api.mercadopago.com/v1/payments', createMercadoPaymentBankSlipOrLotteryDto,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      ).catch(err => {
        console.log(err.config.response, 9999);
        throw err
      }
      )

      return createPost

    } catch (err) {
      if (err.driverError) {
        console.log(err.response.data)
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          console.log(err.response.data)
          throw err
        } else if (err.message) {
          console.log(err.response.data)
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          console.log(err.response.data)
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  
  async createMercadoPagoPix(createMercadoPagoPixDto: createMercadoPagoPixDto) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
        //'X-Idempotency-Key:': `NÃO é OBRIGADO AINDA MAIS QUANDO TIVE ENVIAR UM UUID OU STRING ALEATORIA`
      };

      const createPost = await lastValueFrom(
        this.httpService.post('https://api.mercadopago.com/v1/payments', createMercadoPagoPixDto,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      ).catch(err => {
        console.log(err.config.response, 9999);
        throw err
      }
      )

      return createPost

    } catch (err) {
      if (err.driverError) {
        console.log(err.response.data)
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          console.log(err.response.data)
          throw err
        } else if (err.message) {
          console.log(err.response.data)
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          console.log(err.response.data)
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async getAllPayments(userId: number, query: {
    sort: 'date_approved' | 'date_created' | 'date_last_updated' | 'id' | 'money_release_date';
    criteria: 'asc' | 'desc';
    external_reference: string;
    range: 'date_created' | 'date_last_updated' | 'date_approved' | 'money_release_date';
    begin_date: string;//date -> '2023-09-07T00:00:00.000Z' or "NOW-XDAYS", "NOW-XMONTHS";
    end_date: string//date -> '2023-09-07T00:00:00.000Z' or "NOW-XDAYS", "NOW-XMONTHS";
  }) {
    try {

      let { sort, criteria, external_reference, range, begin_date, end_date } = query;

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
      };

      const queryParams = {
        sort: sort ? sort : null,                                                       //Parâmetro utilizado para a ordenação de uma lista de pagamentos. A ordenação pode ser feita a partir dos seguintes atributos - "date_approved", "date_created", "date_last_updated", "id", "money_release_date".
        criteria: criteria ? criteria : null,                                           //Ordena o pagamento de maneira ascendente (utilizando “asc”) ou descendente (“desc”).
        external_reference: external_reference ? external_reference : null,             //por exemplo busca todos os pagamentos de um userId por exemplo  //É uma referência externa do pagamento. Pode ser, por exemplo, um hashcode do Banco Central, funcionando como identificador de origem da transação.
        range: range ? range : null,                                                    //Parâmetro utilizado para definir o intervalo de busca pelos pagamentos. O intervalo pode ser referente aos seguintes atributos - "date_created", "date_last_updated", "date_approved", "money_release_date". Se não for informado utiliza por padrão "date_created".  
        begin_date: begin_date ? begin_date : null,                                     //data iso8601 ex - '2023-09-07T00:00:00.000Z' -> Define o início do intervalo de busca dos pagamentos. Seu formato pode ser uma data relativa - "NOW-XDAYS", "NOW-XMONTHS" - ou uma data absoluta - ISO8601. Se não for informado utiliza por padrão "NOW-3MONTHS".
        end_date: end_date ? end_date : null                                            //Define o fim do intervalo de busca dos pagamentos. Seu formato pode ser uma data relativa - "NOW-XDAYS", "NOW-XMONTHS" - ou uma data absoluta - ISO8601. Se não for informado utiliza por padrão "NOW".
      };

      const paymentsList = await lastValueFrom(
        this.httpService.get('https://api.mercadopago.com/v1/payments/search',
          { headers: headersRequest, params: queryParams }).pipe(
            map(resp => resp.data)
          )
      );

      return paymentsList
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }


  async getPaymentById(userId: number, paymentId: string) {
    try {
      //https://www.mercadopago.com.br/developers/pt/reference/payments/_payments_id/get

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_PRODUCAO_MERCADOPAGO}`,
      };

      const payment = await lastValueFrom(
        this.httpService.get(`https://api.mercadopago.com/v1/payments/${paymentId}`,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      );

      return payment
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  //estorno metodo para pedir
  async getChargeBacksListByPaymentId(userId: number, paymentId: string) {
    try {
      //https://www.mercadopago.com.br/developers/pt/reference/chargebacks/_payments_id_refunds/get

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
      };

      const estorno = await lastValueFrom(
        this.httpService.get(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      );

      return estorno
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async getChargeBackByPaymentIdAndRefundId(userId: number, paymentId: string, refundId: string) {
    try {
      //https://www.mercadopago.com.br/developers/pt/reference/chargebacks/_payments_id_refunds_refund_id/get

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
      };

      const estorno = await lastValueFrom(
        this.httpService.get(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds/${refundId}`,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      );

      return estorno
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  //criando um reembolso(estorno)
  async createChargeBack(userId: number, paymentId: string, createChargeBackDto: CreateChargeBackDto) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
      };

      const createChargeBack = await lastValueFrom(
        this.httpService.post(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, createChargeBackDto,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      );

      return createChargeBack

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async updatePayment(userId: number, paymentId: string, dataUpdate: UpdateMercadoPagoDto) {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer ${process.env.TOKEN_TEST_MERCADOPAGO}`,
      };

      const createUpdate = await lastValueFrom(
        this.httpService.put(`https://api.mercadopago.com/v1/payments/${paymentId}`, dataUpdate,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      );

      return createUpdate
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          console.log(err)
          throw err
        } else if (err.message) {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async reeiveWebHook(data: any) {
    try {
      console.log(data)

      if(data.action === "payment.created"){
        return ['created',data]
      }else if(data.action === "payment.updated"){
        return ['update',data]
      }

      return true
      
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException([err.message, err], HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }
}
