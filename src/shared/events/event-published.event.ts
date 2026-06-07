export class EventPublishedEvent {
    constructor(
      public readonly eventId: string,
      public readonly organizerId: string,
      public readonly title: string,
    ) {}
  }