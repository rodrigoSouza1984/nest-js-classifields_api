import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreateMercadoPaymentDto } from './dto/create-mercado-payment.dto';
import { UpdateMercadoPagoDto } from './dto/update-mercado-pago.dto';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMercadoPagoDto: UpdateMercadoPagoDto) {
    return this.mercadoPagoService.update(+id, updateMercadoPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mercadoPagoService.remove(+id);
  }
}
