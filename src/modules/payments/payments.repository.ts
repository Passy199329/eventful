import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payments.schema';

@Injectable()
export class PaymentsRepository {

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async create(data: Partial<Payment>) {
    return this.paymentModel.create(data);
  }

  async findAll() {
    return this.paymentModel.find().sort({ createdAt: -1 });
  }

  async findByUser(userId: string) {
    return this.paymentModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByTicketIds(ticketIds: string[]) {
    return this.paymentModel
      .find({ ticketId: { $in: ticketIds } })
      .sort({ createdAt: -1 });
  }

  async findByReference(reference: string) {
    return this.paymentModel.findOne({ reference });
  }

  async updatePayment(reference: string, data: Partial<Payment>) {
    return this.paymentModel.findOneAndUpdate(
      { reference },
      { $set: data },
      { returnDocument: 'after' },
    );
  }
}