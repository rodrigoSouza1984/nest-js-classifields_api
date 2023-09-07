import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMercadoPaymentDto } from './dto/create-mercado-payment.dto';
import { UpdateMercadoPagoDto } from './dto/update-mercado-pago.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class MercadoPagoService {

  constructor(private httpService: HttpService) { }

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

  async getAllPayments(){
    try{
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Bearer TEST-4225031559492417-061420-61232130f4435efef2496d3c8582f69e-826535867`,
      };

      const queryParams = {
        sort: 'date_approved',                 //Parâmetro utilizado para a ordenação de uma lista de pagamentos. A ordenação pode ser feita a partir dos seguintes atributos - "date_approved", "date_created", "date_last_updated", "id", "money_release_date".
        //parametro2: 'valor2',
        // Adicione outros parâmetros de consulta conforme necessário
      };
  
      const paymentsList = await lastValueFrom(
        this.httpService.get('https://api.mercadopago.com/v1/payments/search',
          { headers: headersRequest, params: queryParams }).pipe(
            map(resp => resp.data)
          )
      );  
      
      return paymentsList
    }catch(err){
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
