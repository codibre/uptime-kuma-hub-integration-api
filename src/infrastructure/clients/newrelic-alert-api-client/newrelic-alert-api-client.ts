import { fluentAsync, depaginate } from '@codibre/fluent-iterable';
import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { AlertApiClient } from '@core/clients';
import { AlertApiResponseItem } from '@core/entities/internal';
import { NewRelicAlertResponseResult } from './newrelic-alert-response-result';

@Injectable()
export class AlertAlertApiClient implements AlertApiClient {
  constructor(private client: Axios) {}

  getAlerts(): AsyncIterable<AlertApiResponseItem> {
    let current = 0;
    const depaginateResult = depaginate<NewRelicAlertResponseResult, number>(
      async (token: number | undefined) => {
        const result = await this.client.get('fdsfsdf', {
          params: {
            page: token,
            filter: 'fsdfsdfdsf',
          },
        });
        current += result.data.items.length;
        return {
          results: result.data.items as NewRelicAlertResponseResult[], // itens da página
          nextPageToken:
            result.data.total > current ? (token ?? 1) + 1 : undefined,
        };
      },
    );

    return fluentAsync(depaginateResult).map((x) => x as AlertApiResponseItem);
  }
}
