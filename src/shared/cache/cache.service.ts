import { Injectable }
from '@nestjs/common';

@Injectable()
export class CacheService {

  private cache =
    new Map<string, any>();

  async set(
    key: string,
    value: any,
  ) {

    this.cache.set(
      key,
      value,
    );

    return true;
  }

  async get(
    key: string,
  ) {

    return this.cache.get(
      key,
    );
  }

  async delete(
    key: string,
  ) {

    return this.cache.delete(
      key,
    );
  }

  async clear() {

    this.cache.clear();

    return true;
  }
}