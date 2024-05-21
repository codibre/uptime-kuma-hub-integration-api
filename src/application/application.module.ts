import { DynamicModule, Type } from '@nestjs/common';
import { DomainModule } from '@domain';
import { CoreModule } from '@core';
import * as commandHandlers from './handlers';

const providers = Object.values(commandHandlers);

export class ApplicationModule {
  static forRoot(infraModule: Type<unknown>): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [DomainModule.forRoot(infraModule), CoreModule],
      providers,
      exports: providers,
    };
  }
}
