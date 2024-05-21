import { Module } from '@nestjs/common';
import { CoreModule } from '@core';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheWrapper } from '@core/cache';
import { RememberedCacheWrapper } from './cache/remembered-cache-wrapper';
import { AlertApiClient } from '@core/clients';
import { GrafanaAlertApiClient } from './clients';
import { Axios } from 'axios';

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
    {
      provide: Axios,
      useFactory: (x: HttpService) => x.axiosRef,
      inject: [HttpService],
    },
  ],
  exports: [CacheWrapper, AlertApiClient],
})
export class InfrastructureModule {}
