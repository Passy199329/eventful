import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsRepository {

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: Partial<Notification>) {
    return this.notificationModel.create(data);
  }

  async findByUser(userId: string) {
    return this.notificationModel.find({ userId });
  }

  async updateStatus(id: string, status: string) {
    return this.notificationModel.findByIdAndUpdate(
      id,
      { $set: { status, sent: true } },
      { returnDocument: 'after' },
    );
  }
}