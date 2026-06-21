import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';

@Injectable()
export class TicketsService {

  constructor(
    private readonly ticketsRepository: TicketsRepository,
  ) {}

  async purchaseTicket(userId: string, dto: PurchaseTicketDto) {
    const totalPrice = dto.quantity * 1000;

    return this.ticketsRepository.create({
      userId,
      eventId: dto.eventId,
      ticketType: dto.ticketType,
      quantity: dto.quantity,
      totalPrice,
    });
  }

  async getUserTickets(userId: string) {
    return this.ticketsRepository.findByUser(userId);
  }

  async getAllTickets() {
    return this.ticketsRepository.findAll();
  }

  async getTicketById(id: string) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }
}