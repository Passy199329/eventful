import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics, AnalyticsDocument } from './schemas/analytics.schema';

@Injectable()
export class AnalyticsRepository {

  constructor(
    @InjectModel(Analytics.name)
    private readonly analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async create(data: Partial<Analytics>) {
    return this.analyticsModel.create(data);
  }

  async findAll() {
    return this.analyticsModel.find();
  }

  async findByEvent(eventId: string) {
    return this.analyticsModel.findOne({ eventId });
  }

  async updateAnalytics(eventId: string, data: Partial<Analytics>) {
    return this.analyticsModel.findOneAndUpdate(
      { eventId },
      { $set: data },
      { returnDocument: 'after' },
    );
  }
}