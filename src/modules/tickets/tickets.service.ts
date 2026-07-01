import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { EventsRepository } from '../events/events.repository';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';

@Injectable()
export class TicketsService {

  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async purchaseTicket(userId: string, dto: PurchaseTicketDto) {
    const event = await this.eventsRepository.findById(dto.eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const tier = event.ticketTiers.find(t => t.name === dto.ticketType);

    if (!tier) {
      throw new NotFoundException(
        `No "${dto.ticketType}" ticket tier exists for this event`,
      );
    }

    // Atomic capacity check + increment: only succeeds if the remaining
    // capacity in this specific tier can cover the requested quantity.
    // This prevents overselling if two people buy the last tickets at
    // the same moment.
    const updatedEvent = await this.eventsRepository.incrementTierSold(
      dto.eventId,
      dto.ticketType,
      dto.quantity,
    );

    if (!updatedEvent) {
      throw new BadRequestException(
        `Not enough "${dto.ticketType}" tickets left for this event`,
      );
    }

    const totalPrice = tier.price * dto.quantity;

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

  async getTicketsForEvents(eventIds: string[]) {
    return this.ticketsRepository.findByEventIds(eventIds);
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