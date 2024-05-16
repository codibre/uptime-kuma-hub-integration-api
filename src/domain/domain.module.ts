import { DynamicModule, Type } from '@nestjs/common';
import * as services from './services';
import { CoreModule } from '@core';

const providers = Object.values(services);

export class DomainModule {
  static forRoot(infraModule: Type<unknown>): DynamicModule {
    return {
      module: DomainModule,
      imports: [infraModule, CoreModule],
      providers,
      exports: providers,
    };
  }
}
