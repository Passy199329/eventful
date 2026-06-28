import { Module }
from '@nestjs/common';

import { MongooseModule }
from '@nestjs/mongoose';

import {
  Ticket,
  TicketSchema,
} from '../tickets/schemas/ticket.schema';

import { EventsModule }
from '../events/events.module';

import { QrcodeController }
from './qrcode.controller';

import { QrcodeService }
from './qrcode.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    EventsModule,
  ],

  controllers: [
    QrcodeController,
  ],

  providers: [
    QrcodeService,
  ],

  exports: [
    QrcodeService,
  ],
})
export class QrcodeModule {}