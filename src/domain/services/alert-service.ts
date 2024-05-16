import { Injectable } from '@nestjs/common';
import { CacheWrapper } from '@core/cache';
import { AlertApiClient } from '@core/clients';
import { fluentAsync } from '@codibre/fluent-iterable';
import { AlertStatusEnum } from '@core/entities/internal';

@Injectable()
export class AlertService {
  constructor(
    private alertClient: AlertApiClient,
    private cacheWrapper: CacheWrapper,
  ) {}

  async isOk(alertId: string): Promise<boolean> {
    const dict = await this.getAlertsDictionary();
    return dict[alertId]?.status === AlertStatusEnum.OK;
  }

  async getAlertsDictionary() {
    return this.cacheWrapper.get('alerts:dictionary', async () =>
      fluentAsync(this.alertClient.getAlerts()).toObject('id'),
    );
  }
}
