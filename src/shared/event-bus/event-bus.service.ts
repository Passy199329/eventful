import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventBusService {

  constructor(
    private readonly eventEmitter: EventEmitter2,
  ) {}

  emit(
    eventName: string,
    payload: any,
  ) {

    this.eventEmitter.emit(
      eventName,
      payload,
    );
  }
}