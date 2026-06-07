import { Injectable }
from '@nestjs/common';

import * as nodemailer
from 'nodemailer';

@Injectable()
export class EmailChannel {

  private transporter =
    nodemailer.createTransport({

      service: 'gmail',

      auth: {
        user:
          process.env.EMAIL_USER,

        pass:
          process.env.EMAIL_PASS,
      },
    });

  async send(
    email: string,
    message: string,
  ) {

    await this.transporter
      .sendMail({

        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          'Eventful Notification',

        text: message,
      });

    return {
      success: true,
      message: 'Email sent',
    };
  }
}