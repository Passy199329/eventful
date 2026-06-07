import { Injectable }
from '@nestjs/common';

@Injectable()
export class SharingService {

  generateEventShareLink(
    eventId: string,
  ) {

    return {
      shareLink:
        `https://eventful.com/events/${eventId}`,
    };
  }

  shareToSocialMedia(
    platform: string,
    eventId: string,
  ) {

    const eventUrl =
      `https://eventful.com/events/${eventId}`;

    switch (platform) {

      case 'facebook':

        return {
          url:
            `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
        };

      case 'twitter':

        return {
          url:
            `https://twitter.com/intent/tweet?url=${eventUrl}`,
        };

      case 'whatsapp':

        return {
          url:
            `https://wa.me/?text=${eventUrl}`,
        };

      default:

        return {
          message:
            'Unsupported platform',
        };
    }
  }
}