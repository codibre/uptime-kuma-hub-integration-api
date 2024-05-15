import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AlertStatusCommand } from '../commands';
import { AlertService } from '../../domain/services/alert-service';
import { fluent } from '@codibre/fluent-iterable';
import { identity } from 'rxjs';

@CommandHandler(AlertStatusCommand)
export class AlertStatusCommandHandler
  implements ICommandHandler<AlertStatusCommand, boolean>
{
  constructor(private alertService: AlertService) {}
  async execute(command: AlertStatusCommand): Promise<boolean> {
    return fluent(command.alertIds)
      .map((alertId) => this.alertService.isOk(alertId))
      .toAsync()
      .every(identity);
  }
}
