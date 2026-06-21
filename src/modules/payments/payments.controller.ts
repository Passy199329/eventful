import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';

@Controller('payments')
export class PaymentsController {

  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  initializePayment(
    @CurrentUser() user: any,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get('verify/:reference')
  verifyPayment(@Param('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }

  @Post('webhook')
  handleWebhook(@Body() payload: WebhookPayloadDto) {
    return this.paymentsService.handleWebhook(payload);
  }
}