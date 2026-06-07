import { Injectable }
from '@nestjs/common';

@Injectable()
export class SmsChannel {

  async send(
    phone: string,
    message: string,
  ) {

    console.log(
      `SMS sent to ${phone}: ${message}`,
    );

    return true;
  }
}