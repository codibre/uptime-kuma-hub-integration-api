import { fluentAsync } from '@codibre/fluent-iterable';
import { AlertApiResponseItem, AlertStatusEnum } from '@core/entities/internal';
import { GrafanaAlertApiClient } from '@infrastructure/clients';
import { GrafanaAlertResponse } from '@infrastructure/clients/grafana-alert-api-client/grafana-alert-response';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Axios, AxiosResponse } from 'axios';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const proto = GrafanaAlertApiClient.prototype;

describe(GrafanaAlertApiClient.name, () => {
  let target: GrafanaAlertApiClient;
  let axios: Axios;

  beforeEach(async () => {
    process.env.GRAFANA_ALERT_URL = 'my url';
    delete process.env.GRAFANA_MOCK;
    const module = await Test.createTestingModule({
      providers: [
        GrafanaAlertApiClient,
        {
          provide: Axios,
          useValue: (axios = {} as Axios),
        },
      ],
    }).compile();

    target = module.get(GrafanaAlertApiClient);
  });

  describe(proto.getAlerts.name, () => {
    it('should convert grafana alert result to expected format', async () => {
      // Arrange
      const response = {
        data: {
          data: {
            alerts: [
              {
                state: 'Normal',
                annotations: {
                  __alertId__: 'id1',
                  description: 'alert 1',
                },
              },
              {
                state: 'Normal (no data)',
                annotations: {
                  __alertId__: 'id2',
                },
              },
              {
                state: 'Warning',
                annotations: {
                  __alertId__: 'id3',
                  description: 'alert 3',
                },
              },
            ],
          },
        },
      } as AxiosResponse<GrafanaAlertResponse>;
      axios.get = jest.fn().mockResolvedValue(response);

      // Act
      const result = await fluentAsync(target.getAlerts()).toArray();

      // Assert
      expect(result).toEqual([
        {
          id: 'id1',
          status: AlertStatusEnum.OK,
          description: 'alert 1',
        },
        {
          id: 'id2',
          status: AlertStatusEnum.OK,
          description: undefined,
        },
        {
          id: 'id3',
          status: AlertStatusEnum.Error,
          description: 'alert 3',
        },
      ] as AlertApiResponseItem[]);
      expect(axios.get).toHaveCallsLike(['my url']);
    });

    it('should throw an error when url is falsy', async () => {
      // Arrange
      (target as any).alertUrl = undefined;
      let thrownError: any;

      // Act
      try {
        await fluentAsync(target.getAlerts()).toArray();
      } catch (err) {
        thrownError = err;
      }

      // Assert
      expect(thrownError).toBeInstanceOf(InternalServerErrorException);
    });
  });
});
