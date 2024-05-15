import { AlertStatusEnum } from './alert-status-enum';

export interface AlertApiResponseItem {
  id: string;
  description?: string;
  status: AlertStatusEnum;
}
