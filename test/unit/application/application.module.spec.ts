import 'jest-callslike';
import { Test, TestingModule } from '@nestjs/testing';
import * as handlers from '@application/handlers';
import { fluentObject } from '@codibre/fluent-iterable';
import { ApplicationModule } from '@application/application.module';
import { Module } from '@nestjs/common';
import { CacheWrapper } from '@core/cache';
import { AlertApiClient } from '@core/clients';

describe(ApplicationModule.name, () => {
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
      imports: [ApplicationModule.forRoot(MyModule)],
    }).compile();
  });

  it('should inject all expected core interfaces', async () => {
    fluentObject(handlers as Record<string, Function>)
      .map(1)
      .forEach((item) => {
        expect(target.get(item)).not.toBeNull();
      });
  });
});
