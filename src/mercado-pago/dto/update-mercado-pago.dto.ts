import { PartialType } from '@nestjs/swagger';
import { CreateMercadoPaymentDto } from './create-mercado-payment.dto';

export class UpdateMercadoPagoDto extends PartialType(CreateMercadoPaymentDto) {}
