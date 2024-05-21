import 'jest-callslike';
import { Test, TestingModule } from '@nestjs/testing';
import * as services from '@domain/services';
import { fluentObject } from '@codibre/fluent-iterable';
import { Module } from '@nestjs/common';
import { CacheWrapper } from '@core/cache';
import { AlertApiClient } from '@core/clients';
import { DomainModule } from '@domain/domain.module';

describe(DomainModule.name, () => {
  let target: TestingModule;

  @Module({
    providers: [
      {
        provide: CacheWrapper,
        useValue: {},
      },
      {
        provide: AlertApiClient,
        useValue: {},
      },
    ],
    exports: [CacheWrapper, AlertApiClient],
  })
  class MyModule {}

  beforeEach(async () => {
    target = await Test.createTestingModule({
      imports: [DomainModule.forRoot(MyModule)],
    }).compile();
  });

  it('should inject all expected core interfaces', async () => {
    fluentObject(services as Record<string, Function>)
      .map(1)
      .forEach((item) => {
        expect(target.get(item)).not.toBeNull();
      });
  });
});
