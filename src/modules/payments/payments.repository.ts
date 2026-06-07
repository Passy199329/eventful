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