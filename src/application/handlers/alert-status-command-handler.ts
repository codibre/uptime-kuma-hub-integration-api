import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AlertStatusCommand } from '../commands';
import { AlertService } from '@domain/services/alert-service';
import { fluent, fluentAsync, identity } from '@codibre/fluent-iterable';

@CommandHandler(AlertStatusCommand)
export class AlertStatusCommandHandler
  implements ICommandHandler<AlertStatusCommand, boolean>
{
  constructor(private alertService: AlertService) {}
  async execute(command: AlertStatusCommand): Promise<boolean> {
    return fluentAsync(
      fluent(command.alertIds).waitAll((alertId) =>
        this.alertService.isOk(alertId),
      ),
    ).every(identity);
  }
}
