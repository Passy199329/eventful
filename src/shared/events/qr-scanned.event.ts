export class QrScannedEvent {
    constructor(
      public readonly ticketId: string,
      public readonly userId: string,
      public readonly eventId: string,
      public readonly scannedAt: Date,
    ) {}
  }