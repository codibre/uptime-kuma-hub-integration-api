import { Module } from '@nestjs/common';
import { CoreModule } from '@core';
import { HttpModule } from '@nestjs/axios';
import { CacheWrapper } from '@core/cache';
import { RememberedCacheWrapper } from './cache/remembered-cache-wrapper';
import { AlertApiClient } from '@core/clients';
import { GrafanaAlertApiClient } from './clients';

@Module({
  imports: [CoreModule, HttpModule],
  providers: [
    {
      provide: CacheWrapper,
      useClass: RememberedCacheWrapper,
    },
    {
      provide: AlertApiClient,
      useClass: GrafanaAlertApiClient,
    },
  ],
  exports: [CacheWrapper, AlertApiClient],
})
export class InfrastructureModule {}
