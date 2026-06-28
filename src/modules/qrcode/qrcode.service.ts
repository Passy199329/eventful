import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import * as QRCode
from 'qrcode';

import { InjectModel }
from '@nestjs/mongoose';

import { Model }
from 'mongoose';

import {
  Ticket,
  TicketDocument,
} from '../tickets/schemas/ticket.schema';

import { EventsService }
from '../events/events.service';

@Injectable()
export class QrcodeService {

  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel:
      Model<TicketDocument>,
    private readonly eventsService:
      EventsService,
  ) {}

  async generateQrCode(
    ticketId: string,
  ) {

    const qrCode =
      await QRCode.toDataURL(
        ticketId,
      );

    await this.ticketModel
      .findByIdAndUpdate(
        ticketId,
        { qrCode },
      );

    return {
      ticketId,
      qrCode,
    };
  }

  async verifyQrCode(
    ticketId: string,
    callerId: string,
  ) {

    const ticket =
      await this.ticketModel
        .findById(ticketId);

    if (!ticket) {
      throw new NotFoundException(
        'Ticket not found',
      );
    }

    // getEventById already throws NotFoundException if the event
    // doesn't exist, so no extra null check needed here.
    const event =
      await this.eventsService
        .getEventById(ticket.eventId);

    if (event.creatorId?.toString() !== callerId) {
      throw new ForbiddenException(
        'You can only verify tickets for your own events',
      );
    }

    if (ticket.isScanned) {

      return {
        valid: false,
        message:
          'Ticket already used',
      };
    }

    ticket.isScanned = true;

    await ticket.save();

    return {
      valid: true,
      message:
        'Ticket verified successfully',
      ticket,
    };
  }
}