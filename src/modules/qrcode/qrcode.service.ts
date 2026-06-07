import {
    Injectable,
    NotFoundException,
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
  
  @Injectable()
  export class QrcodeService {
  
    constructor(
      @InjectModel(Ticket.name)
      private readonly ticketModel:
        Model<TicketDocument>,
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
    ) {
  
      const ticket =
        await this.ticketModel
          .findById(ticketId);
  
      if (!ticket) {
        throw new NotFoundException(
          'Ticket not found',
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