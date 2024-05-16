import { AlertApiResponseItem } from '../entities/internal';

export abstract class AlertApiClient {
  abstract getAlerts(): AsyncIterable<AlertApiResponseItem>;
}
