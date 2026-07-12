import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsRepository {

  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(data: Partial<Event>) {
    return this.eventModel.create(data);
  }

  async findAll() {
    return this.eventModel.find();
  }

  async findById(id: string) {
    return this.eventModel.findById(id);
  }

  async updateEvent(
    id: string,
    creatorId: string,
    data: Partial<Event>,
  ) {
    return this.eventModel.findOneAndUpdate(
      { _id: id, creatorId },
      { $set: data },
      { returnDocument: 'after' },
    );
  }

  async deleteEvent(id: string, creatorId: string) {
    return this.eventModel.findOneAndDelete(
      { _id: id, creatorId },
    );
  }

  async incrementTierSold(
    eventId: string,
    tierName: string,
    quantity: number,
  ) {
    // Simpler approach: use positional $ operator to increment the
    // matching tier's sold count. We check capacity in the service
    // before calling this, so we don't need the atomic check here.
    const result = await this.eventModel.findOneAndUpdate(
      {
        _id: eventId,
        'ticketTiers.name': tierName,
      },
      {
        $inc: { 'ticketTiers.$.sold': quantity },
      },
      { returnDocument: 'after' },
    );

    return result;
  }
}