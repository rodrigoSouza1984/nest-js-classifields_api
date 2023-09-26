import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreateMercadoPaymentDto } from './dto/create-mercado-payment.dto';
import { UpdateMercadoPagoDto } from './dto/update-mercado-pago.dto';
import { CreateChargeBackDto } from './dto/create-charge-back.dto';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  //link doc mercado livre => https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post

  @Post()
  create(@Body() createMercadoPagoDto: CreateMercadoPaymentDto) {
    return this.mercadoPagoService.create(createMercadoPagoDto);
  }

  @Get('/:userId')
  getAllPayments(@Param('userId') userId: number, @Query() query: {         
     sort: 'date_approved' | 'date_created' | 'date_last_updated' | 'id' | 'money_release_date';
     criteria: 'asc' | 'desc'; 
     external_reference: string; 
     range: 'date_created' | 'date_last_updated' | 'date_approved' | 'money_release_date';
     begin_date: string;//date -> '2023-09-07T00:00:00.000Z' or "NOW-XDAYS", "NOW-XMONTHS";
     end_date: string//date -> '2023-09-07T00:00:00.000Z' or "NOW-XDAYS", "NOW-XMONTHS";
    }) {
    return this.mercadoPagoService.getAllPayments(userId, query);
  }  

  @Get(':userId/:paymentId')
  findOne(@Param('userId') userId: number, @Param('paymentId') paymentId: string) {
    return this.mercadoPagoService.getPaymentById(userId, paymentId);
  }
  
  @Post('createChargeBack/create/:userId/:paymentId')
  createChargeBack(@Param('userId') userId: number, @Param('paymentId') paymentId: string, @Body() createChargeBackDto: CreateChargeBackDto) {    
    return this.mercadoPagoService.createChargeBack( userId, paymentId, createChargeBackDto,);
  }
  
  @Get('getChargeBacksListByPaymentId/:userId/:paymentId')
  getChargeBacksListByPaymentId(@Param('userId') userId: number, @Param('paymentId') paymentId: string ) {    
    return this.mercadoPagoService.getChargeBacksListByPaymentId(userId, paymentId );
  }

  @Get('getChargeBackByPaymentIdAndRefundId/:userId/:paymentId/:refundId')
  getChargeBackByPaymentIdAndRefundId(@Param('userId') userId: number, @Param('paymentId') paymentId: string, @Param('refundId') refundId: string ) {   
    return this.mercadoPagoService.getChargeBackByPaymentIdAndRefundId(userId, paymentId, refundId );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMercadoPagoDto: UpdateMercadoPagoDto) {
    return this.mercadoPagoService.update(+id, updateMercadoPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mercadoPagoService.remove(+id);
  }
}
