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

  // Named routes must come BEFORE the wildcard @Get('verify/:reference')
  // otherwise NestJS would match 'my-purchases' and 'received' as a
  // :reference param value instead of their own routes.
  @Get('my-purchases')
  @UseGuards(JwtAuthGuard)
  getMyPurchases(@CurrentUser() user: any) {
    return this.paymentsService.getMyPurchases(user.sub);
  }

  @Get('received')
  @UseGuards(JwtAuthGuard)
  getReceivedPayments(@CurrentUser() user: any) {
    return this.paymentsService.getReceivedPayments(user.sub);
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