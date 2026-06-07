
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
  ) {}

  async createEvent(
    creatorId: string,
    dto: CreateEventDto,
  ) {
    return this.eventsRepository.create({
      creatorId,
      ...dto,
    });
  }

  async getAllEvents() {
    return this.eventsRepository.findAll();
  }

  async getEventById(id: string) {
    const event =
      await this.eventsRepository.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async updateEvent(
    id: string,
    creatorId: string,
    dto: UpdateEventDto,
  ) {
    const event =
      await this.eventsRepository.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId?.toString() !== creatorId) {
      throw new ForbiddenException(
        'You can only update your own events',
      );
    }

    return this.eventsRepository.updateEvent(
      id,
      creatorId,
      dto,
    );
  }

  async deleteEvent(
    id: string,
    creatorId: string,
  ) {
    const event =
      await this.eventsRepository.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId?.toString() !== creatorId) {
      throw new ForbiddenException(
        'You can only delete your own events',
      );
    }

    await this.eventsRepository.deleteEvent(
      id,
      creatorId,
    );

    return { message: 'Event deleted successfully' };
  }
}