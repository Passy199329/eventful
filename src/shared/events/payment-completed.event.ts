export class PaymentCompletedEvent {
    constructor(
      public readonly paymentId: string,
      public readonly userId: string,
      public readonly amount: number,
      public readonly eventId: string,
    ) {}
  }