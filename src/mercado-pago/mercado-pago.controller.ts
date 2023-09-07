import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get()
  getAllPayments() {
    return this.mercadoPagoService.getAllPayments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mercadoPagoService.findOne(+id);
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
