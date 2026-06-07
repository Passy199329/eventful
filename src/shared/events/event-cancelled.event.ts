export class EventCancelledEvent {
    constructor(
      public readonly eventId: string,
      public readonly reason: string,
    ) {}
  }