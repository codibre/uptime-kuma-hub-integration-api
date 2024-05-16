import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AlertStatusCommand } from '@application/commands';

@Controller('/alerts')
export class AlertsController {
  constructor(private readonly bus: CommandBus) {}

  @Get()
  async get(@Query('alertIds') alertIds: string | string[]) {
    if (typeof alertIds == 'string') alertIds = alertIds.split(',');

    const result: boolean = await this.bus.execute(
      new AlertStatusCommand(alertIds),
    );
    if (!result) throw new InternalServerErrorException();
  }
}
