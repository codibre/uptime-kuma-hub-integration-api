import {
  RememberedCacheWrapper,
  RememberedConfigWrapper,
} from '@infrastructure/cache';
import { Test } from '@nestjs/testing';
import { setTimeout } from 'timers/promises';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const proto = RememberedCacheWrapper.prototype;

describe(RememberedCacheWrapper.name, () => {
  let target: RememberedCacheWrapper;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RememberedCacheWrapper,
        {
          provide: RememberedConfigWrapper,
          useFactory: () => {
            const config: RememberedConfigWrapper = {
              ttl: 10,
            };
            return config;
          },
        },
      ],
    }).compile();

    target = module.get(RememberedCacheWrapper);
  });

  describe(proto.get.name, () => {
    it('should cache result for the given key for the configured time', async () => {
      // Arrange
      const key = 'key1';
      let i = 1;
      const cb = jest.fn().mockImplementation(() => i++);

      // Act
      const result1 = await target.get(key, cb);
      const result2 = await target.get(key, cb);
      await setTimeout(11);
      const result3 = await target.get(key, cb);

      // Assert
      expect(result1).toBe(1);
      expect(result1).toBe(result2);
      expect(result3).toBe(2);
    });
  });
});
