import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreateMercadoPaymentBankSlipOrLotteryDto } from './dto/create-mercado-pago-bankslip-and-lottery-payment';
import { CreateMercadoPaymentCreditOrDebitDto } from './dto/create-mercado-card-debit-or-credit-payment.dto';
import { CreateChargeBackDto } from './dto/create-charge-back.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';


@ApiTags('mercado-pago')
@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}  

  @ApiOperation({
    summary: 'create-Payment-Credit-Or-Debit',
    description: `Make a payment by credit card and debit card`,
    tags: ['mercado-pago'],
  })  
  @UseGuards(JwtAuthGuard)
  @Post('/createPaymentCreditOrDebit')
  createPaymentCreditOrDebit(@Body() createMercadoPaymentCreditOrDebitDto: CreateMercadoPaymentCreditOrDebitDto) {
    return this.mercadoPagoService.createPaymentCreditOrDebit(createMercadoPaymentCreditOrDebitDto);
  }
  
  @ApiOperation({
    summary: 'create-Payment-bankslip-Or-lottery',
    description: `Make a payment by bankslip and lottery`,
    tags: ['mercado-pago'],
  })
  @UseGuards(JwtAuthGuard)
  @Post('/bankSlipOrLoterica/createPaymentBankSlipOrLoterica')
  createPaymentBankSlipOrLoterica(@Body() createMercadoPaymentBankSlipOrLotteryDto: CreateMercadoPaymentBankSlipOrLotteryDto) {    
    return this.mercadoPagoService.createPaymentBankSlipOrLoterica(createMercadoPaymentBankSlipOrLotteryDto);
  }

  @ApiOperation({
    summary: 'create-Payment-pix',
    description: `Make a payment by pix`,
    tags: ['mercado-pago'],
  })
  @UseGuards(JwtAuthGuard)
  @Post('/pix/createMercadoPagoPix')
  createMercadoPagoPix(@Body() createMercadoPaymentCreditOrDebitDto: CreateMercadoPaymentCreditOrDebitDto) {        
    return this.mercadoPagoService.createMercadoPagoPix(createMercadoPaymentCreditOrDebitDto);
  }

  @ApiOperation({
    summary: 'get-All-Payments',
    description: `get-All-Payments by query paramns`,
    tags: ['mercado-pago'],
  })
  @ApiQuery({ name: 'sort', description: 'date_approved , date_created , date_last_updated , id or money_release_date', required: false })
  @ApiQuery({ name: 'criteria', description: 'asc or desc', required: false })
  @ApiQuery({ name: 'external_reference', description: 'string', required: false })
  @ApiQuery({ name: 'range', description: 'date_created , date_last_updated , date_approved or money_release_date', required: false })
  @ApiQuery({ name: 'begin_date', description: 'string date -> 2023-09-07T00:00:00.000Z or NOW-XDAYS, NOW-XMONTHS', required: false })
  @ApiQuery({ name: 'end_date', description: 'string date -> 2023-09-07T00:00:00.000Z or NOW-XDAYS, NOW-XMONTHS', required: false })
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({
    summary: 'get payment by payment id',
    description: `get payment by payment id, send by param the userId and paymentId`,
    tags: ['mercado-pago'],
  })
  @UseGuards(JwtAuthGuard)
  @Get(':userId/:paymentId')
  findOne(@Param('userId') userId: number, @Param('paymentId') paymentId: string) {
    return this.mercadoPagoService.getPaymentById(userId, paymentId);
  }
  
  @ApiOperation({
    summary: 'create-Charge-Back',
    description: `make a charge back of some purchase send paramns userId and paymentId , and the body createChargeBackDto`,
    tags: ['mercado-pago'],
  })
  @UseGuards(JwtAuthGuard)
  @Post('createChargeBack/create/:userId/:paymentId')
  createChargeBack(@Param('userId') userId: number, @Param('paymentId') paymentId: string, @Body() createChargeBackDto: CreateChargeBackDto) {    
    return this.mercadoPagoService.createChargeBack( userId, paymentId, createChargeBackDto,);
  }
  
  @ApiOperation({
    summary: 'get-Charge-Backs-List-By-Payment-Id',
    description: `get list of charge backs created by payment id`,
    tags: ['mercado-pago'],
  })
  @UseGuards(JwtAuthGuard)
  @Get('getChargeBacksListByPaymentId/:userId/:paymentId')
  getChargeBacksListByPaymentId(@Param('userId') userId: number, @Param('paymentId') paymentId: string ) {    
    return this.mercadoPagoService.getChargeBacksListByPaymentId(userId, paymentId );
  }

  @ApiOperation({
    summary: 'get charge back by refunded id',
    description: `return a charge back realized by refunded id`,
    tags: ['mercado-pago'],
  })
  @UseGuards(JwtAuthGuard)
  @Get('getChargeBackByPaymentIdAndRefundId/:userId/:paymentId/:refundId')
  getChargeBackByPaymentIdAndRefundId(@Param('userId') userId: number, @Param('paymentId') paymentId: string, @Param('refundId') refundId: string ) {   
    return this.mercadoPagoService.getChargeBackByPaymentIdAndRefundId(userId, paymentId, refundId );
  }
  
  // @UseGuards(JwtAuthGuard)
  // @Put('updatePayment/:userId/:paymentId')
  // updatePayment(@Param('userId') userId: number, @Param('paymentId') paymentId: string, @Body() updateMercadoPagoDto: UpdateMercadoPagoDto) {
  //   return this.mercadoPagoService.updatePayment(userId, paymentId, updateMercadoPagoDto);
  // }
  
  // @Post('reeiveWebHook')
  // reeiveWebHook(@Body() data: any) {
  //   console.log('aaaaa')
  //   return this.mercadoPagoService.reeiveWebHook(data);
  // }

}
