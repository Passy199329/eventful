import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketsRepository {

  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async create(data: Partial<Ticket>) {
    return this.ticketModel.create(data);
  }

  async findAll() {
    return this.ticketModel.find();
  }

  async findByUser(userId: string) {
    return this.ticketModel.find({ userId });
  }

  async findByEventIds(eventIds: string[]) {
    return this.ticketModel.find({ eventId: { $in: eventIds } });
  }

  async findById(id: string) {
    return this.ticketModel.findById(id);
  }

  async updateTicket(id: string, data: Partial<Ticket>) {
    return this.ticketModel.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: 'after' },
    );
  }
}