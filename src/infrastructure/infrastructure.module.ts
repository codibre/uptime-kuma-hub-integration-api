import { Module } from '@nestjs/common';
import { CoreModule } from '@core';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheWrapper } from '@core/cache';
import { RememberedCacheWrapper, RememberedConfigWrapper } from './cache';
import { AlertApiClient } from '@core/clients';
import { GrafanaAlertApiClient } from './clients';
import { Axios } from 'axios';
import ms from 'ms';

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
    {
      provide: RememberedConfigWrapper,
      useFactory: () => {
        const config: RememberedConfigWrapper = {
          ttl: ms('30s'),
        };
        return config;
      },
    },
  ],
  exports: [CacheWrapper, AlertApiClient],
})
export class InfrastructureModule {}
