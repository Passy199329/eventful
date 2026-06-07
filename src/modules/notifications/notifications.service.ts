import { Injectable }
from '@nestjs/common';

import { InjectQueue }
from '@nestjs/bullmq';

import { Queue }
from 'bullmq';

import { NotificationsRepository }
from './notifications.repository';

import { SetReminderDto }
from './dto/set-reminder.dto';

import { EmailChannel }
from './channels/email.channel';

import { SmsChannel }
from './channels/sms.channel';

import { PushChannel }
from './channels/push.channel';

@Injectable()
export class NotificationsService {

  constructor(

    private readonly notificationsRepository:
      NotificationsRepository,

    private readonly emailChannel:
      EmailChannel,

    private readonly smsChannel:
      SmsChannel,

    private readonly pushChannel:
      PushChannel,

    @InjectQueue(
      'notification-queue',
    )
    private readonly notificationQueue:
      Queue,
  ) {}

  async setReminder(
    userId: string,
    dto: SetReminderDto,
  ) {

    const notification =
      await this.notificationsRepository
        .create({
          userId,
          ...dto,
        });

    const delay =
      new Date(
        dto.reminderDate,
      ).getTime() - Date.now();

    await this.notificationQueue.add(

      'send-reminder',

      {
        notificationId:
          notification.id,

        userId,

        channel:
          dto.channel,

        message:
          dto.message,
      },

      {
        delay,

        attempts: 3,

        removeOnComplete: true,
      },
    );

    return {
      message:
        'Reminder scheduled successfully',

      notification,
    };
  }

  async sendNotification(
    channel: string,
    recipient: string,
    message: string,
  ) {

    switch (channel) {

      case 'email':

        return this.emailChannel
          .send(
            recipient,
            message,
          );

      case 'sms':

        return this.smsChannel
          .send(
            recipient,
            message,
          );

      case 'push':

        return this.pushChannel
          .send(
            recipient,
            message,
          );

      default:

        return null;
    }
  }

  async getMyNotifications(
    userId: string,
  ) {

    return this.notificationsRepository
      .findByUser(userId);
  }
}