import { Remembered } from 'remembered';
import { CacheWrapper } from '@core/cache';
import { Injectable } from '@nestjs/common';
import { RememberedConfigWrapper } from './remembered-config-wrapper';

@Injectable()
export class RememberedCacheWrapper implements CacheWrapper {
  private remembered: Remembered;

  constructor(config: RememberedConfigWrapper) {
    this.remembered = new Remembered(config);
  }

  get<T>(key: string, cb: () => Promise<T>): Promise<T> {
    return this.remembered.get<T>(key, cb);
  }
}
