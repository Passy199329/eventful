import { Injectable }
from '@nestjs/common';

@Injectable()
export class PushChannel {

  async send(
    userId: string,
    message: string,
  ) {

    console.log(
      `Push notification to ${userId}: ${message}`,
    );

    return true;
  }
}