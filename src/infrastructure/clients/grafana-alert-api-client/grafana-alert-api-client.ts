import { fluentAsync } from '@codibre/fluent-iterable';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Axios } from 'axios';
import { AlertApiClient } from '@core/clients';
import { AlertApiResponseItem, AlertStatusEnum } from '@core/entities/internal';
import { GrafanaAlertResponse } from './grafana-alert-response';

@Injectable()
export class GrafanaAlertApiClient implements AlertApiClient {
  private readonly mock = process.env.GRAFANA_MOCK === 'true';
  private readonly alertUrl = process.env.GRAFANA_ALERT_URL;

  constructor(private client: Axios) {}

  getAlerts(): AsyncIterable<AlertApiResponseItem> {
    let result: GrafanaAlertResponse[] | Promise<GrafanaAlertResponse[]>;
    if (this.mock) result = require('./mock');
    else {
      if (!this.alertUrl) {
        throw new InternalServerErrorException('No grafana alert url found!');
      }
      result = this.client
        .get<GrafanaAlertResponse>(this.alertUrl)
        .then((x) => [x.data]);
    }

    return fluentAsync(result)
      .flatMap((x) => x.data.alerts)
      .map((item) => {
        const alertId = item.annotations.__alertId__;
        if (alertId) {
          return {
            id: alertId,
            status: item.state.startsWith('Normal')
              ? AlertStatusEnum.OK
              : AlertStatusEnum.Error,
            description: item.annotations.description,
          };
        }
      })
      .filter();
  }
}
