import 'jest-callslike';
import { Test, TestingModule } from '@nestjs/testing';
import * as handlers from '@application/handlers';
import * as services from '@domain/services';
import * as clients from '@core/clients';
import * as caches from '@core/cache';
import * as controllers from '@entrypoint/http/controllers';
import { fluentObject } from '@codibre/fluent-iterable';
import { EntryPointHttpModule } from '@entrypoint/http';

describe(EntryPointHttpModule.name, () => {
  let target: TestingModule;

  beforeEach(async () => {
    target = await Test.createTestingModule({
      imports: [EntryPointHttpModule],
    }).compile();
  });

  it('should inject all expected core interfaces', async () => {
    fluentObject(clients as Record<string, Function>)
      .map(1)
      .concat(fluentObject(caches).map(1))
      .concat(fluentObject(controllers).map(1))
      .concat(fluentObject(handlers).map(1))
      .concat(fluentObject(services).map(1))
      .forEach((item) => {
        expect(target.get(item)).not.toBeNull();
      });
  });
});
