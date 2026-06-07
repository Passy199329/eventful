import { Module }
from '@nestjs/common';

import { MongooseModule }
from '@nestjs/mongoose';

import {
  Ticket,
  TicketSchema,
} from './schemas/ticket.schema';

import { TicketsController }
from './tickets.controller';

import { TicketsService }
from './tickets.service';

import { TicketsRepository }
from './tickets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
  ],

  controllers: [
    TicketsController,
  ],

  providers: [
    TicketsService,
    TicketsRepository,
  ],

  exports: [
    TicketsService,
  ],
})
export class TicketsModule {}