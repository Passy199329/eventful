export class TicketPurchasedEvent {
    constructor(
      public readonly userId: string,
      public readonly ticketId: string,
      public readonly eventId: string,
    ) {}
  }