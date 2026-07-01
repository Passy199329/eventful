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
    // MongoDB can't directly compare two fields within the same array
    // element using a simple query filter, so we use aggregation-pipeline
    // syntax in the update (supported since MongoDB 4.2+) to express
    // "only increment sold if capacity - sold >= quantity" atomically.
    // This prevents overselling a tier if two purchases race each other.
    const result = await this.eventModel.updateOne(
      {
        _id: eventId,
        'ticketTiers.name': tierName,
      },
      [
        {
          $set: {
            ticketTiers: {
              $map: {
                input: '$ticketTiers',
                as: 'tier',
                in: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$$tier.name', tierName] },
                        { $gte: [{ $subtract: ['$$tier.capacity', '$$tier.sold'] }, quantity] },
                      ],
                    },
                    {
                      $mergeObjects: [
                        '$$tier',
                        { sold: { $add: ['$$tier.sold', quantity] } },
                      ],
                    },
                    '$$tier',
                  ],
                },
              },
            },
          },
        },
      ],
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return this.eventModel.findById(eventId);
  }
}