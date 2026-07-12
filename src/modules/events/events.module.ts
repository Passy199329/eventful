import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Event, EventSchema } from './schemas/event.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventsRepository,
  ],
  exports: [
    EventsService,
    EventsRepository,
  ],
})
export class EventsModule {}