import { Module } from '@nestjs/common';
import { AlertsController } from './controllers/alerts.controller';
import { ApplicationModule } from '@application';
import { CoreModule } from '@core';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    ApplicationModule.forRoot(InfrastructureModule),
    CoreModule,
  ],
  controllers: [AlertsController],
})
export class EntryPointHttpModule {}
