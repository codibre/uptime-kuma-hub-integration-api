import { fluentAsync } from '@codibre/fluent-iterable';
import { CacheWrapper } from '@core/cache';
import { AlertApiClient } from '@core/clients';
import { AlertApiResponseItem, AlertStatusEnum } from '@core/entities/internal';
import { AlertService } from '@domain/services';
import { Test } from '@nestjs/testing';

const proto = AlertService.prototype;

describe(AlertService.name, () => {
  let target: AlertService;
  let alertClient: AlertApiClient;
  let cacheWrapper: CacheWrapper;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlertService,
        {
          provide: AlertApiClient,
          useValue: (alertClient = {} as AlertApiClient),
        },
        {
          provide: CacheWrapper,
          useValue: (cacheWrapper = {} as CacheWrapper),
        },
      ],
    }).compile();

    target = module.get(AlertService);
  });

  describe(proto.isOk.name, () => {
    let getAlertsDictionary: jest.SpyInstance;

    beforeEach(() => {
      getAlertsDictionary = target.getAlertsDictionary = jest
        .fn()
        .mockResolvedValue({
          alertId: {
            id: 'alertId',
            status: AlertStatusEnum.OK,
          } as AlertApiResponseItem,
        } as Record<string, AlertApiResponseItem>);
    });

    it('should return ok when alert is ok on dictionary', async () => {
      // Arrange
      const id = 'alertId';

      // Act
      const result = await target.isOk(id);

      // Assert
      expect(result).toBe(true);
      expect(getAlertsDictionary).toHaveCallsLike([]);
    });

    it('should return ok when alert is not on the dictionary', async () => {
      // Arrange
      const id = 'unknownAlertId';

      // Act
      const result = await target.isOk(id);

      // Assert
      expect(result).toBe(false);
      expect(getAlertsDictionary).toHaveCallsLike([]);
    });

    it('should return ok when alert is not ok on the dictionary', async () => {
      // Arrange
      const id = 'alertId';
      getAlertsDictionary.mockResolvedValue({
        [id]: {
          id,
          status: AlertStatusEnum.Warning,
        } as AlertApiResponseItem,
      } as Record<string, AlertApiResponseItem>);

      // Act
      const result = await target.isOk(id);

      // Assert
      expect(result).toBe(false);
      expect(getAlertsDictionary).toHaveCallsLike([]);
    });
  });

  describe(proto.getAlertsDictionary.name, () => {
    let getAlerts: jest.SpyInstance<AsyncIterable<AlertApiResponseItem>>;

    beforeEach(() => {
      getAlerts = alertClient.getAlerts = jest.fn();
      cacheWrapper.get = jest.fn().mockImplementation((_, b) => b());
    });

    it('should create, cache and return a dictionary based on getAlerts result', async () => {
      // Arrange
      const apiResult = [
        {
          id: 'id1',
          status: AlertStatusEnum.OK,
        },
        {
          id: 'id2',
          status: AlertStatusEnum.Error,
        },
        {
          id: 'id3',
          status: AlertStatusEnum.Warning,
        },
      ] as AlertApiResponseItem[];
      getAlerts.mockReturnValue(fluentAsync(apiResult));

      // Act
      const result = await target.getAlertsDictionary();

      // Assert
      expect(result).toEqual({
        [apiResult[0]!.id]: apiResult[0],
        [apiResult[1]!.id]: apiResult[1],
        [apiResult[2]!.id]: apiResult[2],
      });
    });
  });
});
