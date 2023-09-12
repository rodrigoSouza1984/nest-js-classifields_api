import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMercadoPaymentDto } from './dto/create-mercado-payment.dto';
import { UpdateMercadoPagoDto } from './dto/update-mercado-pago.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MercadoPagoService {

  constructor( 
    @InjectRepository(User) private userRepository: Repository<User>,
    private httpService: HttpService
  ) { }

  async create(createMercadoPagoDto: CreateMercadoPaymentDto) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer TEST-4225031559492417-061420-61232130f4435efef2496d3c8582f69e-826535867`,
      };

      const createPost = await lastValueFrom(
        this.httpService.post('https://api.mercadopago.com/v1/payments', createMercadoPagoDto,
          { headers: headersRequest }).pipe(
            map(resp => resp.data)
          )
      );

      return createPost

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

// cartao teste
// Mastercard -> NUMERO -> 5031 4332 1540 6351 - COD SEG -> 123 - DATA VENC -> 11 / 25


// compra com usuario diferente

// Rafael Santos
// rafael@hotmail.com
// cpf 01234567890


  async getAllPayments(userId: number, query: {         
    sort: 'date_approved' | 'date_created' | 'date_last_updated' | 'id' | 'money_release_date';
    criteria: 'asc' | 'desc'; 
    external_reference: string; 
    range: 'date_created' | 'date_last_updated' | 'date_approved' | 'money_release_date';
    begin_date: string;//date -> '2023-09-07T00:00:00.000Z' or "NOW-XDAYS", "NOW-XMONTHS";
    end_date: string//date -> '2023-09-07T00:00:00.000Z' or "NOW-XDAYS", "NOW-XMONTHS";
   }){
  try {

    let { sort, criteria, external_reference, range, begin_date, end_date  } = query;

    const userExists = await this.userRepository.findOne({where : {id : userId}})

    if (!userExists) {
      throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
    }

    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'Authorization': `Bearer TEST-4225031559492417-061420-61232130f4435efef2496d3c8582f69e-826535867`,
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


async getPaymentById(userId: number, paymentId: string){
try { 

  const userExists = await this.userRepository.findOne({where : {id : userId}})

  if (!userExists) {
    throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
  }  

  const headersRequest = {
    'Content-Type': 'application/json', // afaik this one is not needed
    'Authorization': `Bearer TEST-4225031559492417-061420-61232130f4435efef2496d3c8582f69e-826535867`,
  }; 

  const payment = await lastValueFrom(
    this.httpService.get(`https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: headersRequest}).pipe(
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


findAll() {
  return `This action returns all mercadoPago`;
}

findOne(id: number) {
  return `This action returns a #${id} mercadoPago`;
}

update(id: number, updateMercadoPagoDto: UpdateMercadoPagoDto) {
  return `This action updates a #${id} mercadoPago`;
}

remove(id: number) {
  return `This action removes a #${id} mercadoPago`;
}
}
