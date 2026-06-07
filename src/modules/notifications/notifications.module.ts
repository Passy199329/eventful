import { Module }
from '@nestjs/common';

import { BullModule }
from '@nestjs/bullmq';

import { MongooseModule }
from '@nestjs/mongoose';

import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

import { NotificationsController }
from './notifications.controller';

import { NotificationsService }
from './notifications.service';

import { NotificationsRepository }
from './notifications.repository';

import { EmailChannel }
from './channels/email.channel';

import { SmsChannel }
from './channels/sms.channel';

import { PushChannel }
from './channels/push.channel';

import { ReminderProcessor }
from './processors/reminder.processor';

@Module({
  imports: [

    MongooseModule.forFeature([
      {
        name:
          Notification.name,

        schema:
          NotificationSchema,
      },
    ]),

    BullModule.registerQueue({
      name:
        'notification-queue',
    }),
  ],

  controllers: [
    NotificationsController,
  ],

  providers: [
    NotificationsService,
    NotificationsRepository,
    EmailChannel,
    SmsChannel,
    PushChannel,
    ReminderProcessor,
  ],

  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}