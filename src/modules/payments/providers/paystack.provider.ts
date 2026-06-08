import axios from 'axios';

export class PaystackProvider {

  private readonly baseUrl =
    'https://api.paystack.co';

  private readonly secretKey =
    process.env.PAYSTACK_SECRET_KEY;

  private readonly callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL;

  async initializePayment(
    email: string,
    amount: number,
  ) {
    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
        callback_url: this.callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data;
  }
}