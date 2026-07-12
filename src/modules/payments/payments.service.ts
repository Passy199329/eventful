import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaymentsRepository } from './payments.repository';
import { PaystackProvider } from './providers/paystack.provider';
import { EventsService } from '../events/events.service';
import { TicketsService } from '../tickets/tickets.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';

@Injectable()
export class PaymentsService {

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly eventsService: EventsService,
    private readonly ticketsService: TicketsService,
  ) {}

  private readonly paystackProvider = new PaystackProvider();

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    const response = await this.paystackProvider.initializePayment(
      dto.email,
      dto.amount,
    );

    await this.paymentsRepository.create({
      userId,
      ticketId: dto.ticketId,
      email: dto.email,
      amount: dto.amount,
      reference: response.data.reference,
    });

    return response.data;
  }

  async getAllPayments() {
    return this.paymentsRepository.findAll();
  }

  async getMyPurchases(userId: string) {
    return this.paymentsRepository.findByUser(userId);
  }

  async getReceivedPayments(creatorId: string) {
    const allEvents = await this.eventsService.getAllEvents();
    const myEventIds = allEvents
      .filter((ev: any) => ev.creatorId?.toString() === creatorId)
      .map((ev: any) => ev._id.toString());

    if (myEventIds.length === 0) return [];

    const myTickets = await this.ticketsService.getTicketsForEvents(myEventIds);
    const myTicketIds = myTickets.map((t: any) => t._id.toString());

    if (myTicketIds.length === 0) return [];

    return this.paymentsRepository.findByTicketIds(myTicketIds);
  }

  async verifyPayment(reference: string) {
    const payment = await this.paymentsRepository.findByReference(reference);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const response = await this.paystackProvider.verifyPayment(reference);

    if (response.data.status === 'success') {
      await this.paymentsRepository.updatePayment(reference, {
        status: 'success',
      });
    }

    return response.data;
  }

  async handleWebhook(payload: WebhookPayloadDto) {
    if (payload.event === 'charge.success') {
      await this.paymentsRepository.updatePayment(
        payload.data.reference,
        { status: 'success' },
      );
    }

    return { received: true };
  }
}