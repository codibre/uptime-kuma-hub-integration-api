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
    fluentObject(clients as Record<string, Function>)
      .map(1)
      .concat(fluentObject(caches).map(1))
      .forEach(item => {
        expect(target.get(item)).not.toBeNull();
      });
  });
});
