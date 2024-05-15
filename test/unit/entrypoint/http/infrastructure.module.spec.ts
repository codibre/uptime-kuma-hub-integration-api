import 'jest-callslike';
import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import * as clients from '@core/clients';
import * as caches from '@core/cache';
import { fluentObject } from '@codibre/fluent-iterable';

describe(InfrastructureModule.name, () => {
  let target: TestingModule;

  beforeEach(async () => {
    target = await Test.createTestingModule({
      imports: [InfrastructureModule],
    }).compile();
  });

  it('should inject all expected core interfaces', async () => {
    fluentObject(clients)
      .map(1)
      .combine(fluentObject(caches).map(1))
      .forEach(item => {
        expect(target.get(item.constructor)).toBe([item]);
      });
  });
});
