import { Remembered } from 'remembered';
import { CacheWrapper } from '../../core/cache';
import ms from 'ms';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RememberedCacheWrapper implements CacheWrapper {
  private remembered = new Remembered({
    ttl: ms('30s'),
  });

  get<T>(key: string, cb: () => Promise<T>): Promise<T> {
    return this.remembered.get<T>(key, cb);
  }
}
