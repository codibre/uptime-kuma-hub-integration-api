import { fluent } from '@codibre/fluent-iterable';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AlertApiClient } from '@core/clients';
import {
  AlertApiResponseItem,
  AlertStatusEnum,
} from '@core/entities/internal';
// import { firstValueFrom } from 'rxjs';
import { GrafanaAlertResponse } from './grafana-alert-response';
import { test } from './mock';

@Injectable()
export class GrafanaAlertApiClient implements AlertApiClient {
  constructor(private client: HttpService) {}

  async *getAlerts(): AsyncIterable<AlertApiResponseItem> {
    // const result = (await firstValueFrom(
    //   this.client.get<GrafanaAlertResponse>(
    //     'https://grafana.gb.tech/api/prometheus/grafana/api/v1/alerts',
    //   ),
    // )).data;

    const result: GrafanaAlertResponse = test;
    yield* fluent(result.data.alerts)
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
