import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from '../../../../../src/entrypoint/http/controllers/alerts.controller';
import { CommandBus } from '@nestjs/cqrs';
import { AlertStatusCommand } from '../../../../../src/application/commands';
import { InternalServerErrorException } from '@nestjs/common';
import 'jest-callslike';

const proto = AlertsController.prototype;

describe(AlertsController.name, () => {
  let appController: AlertsController;
  let bus: CommandBus;

  beforeEach(async () => {
    bus = {} as CommandBus;
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: CommandBus,
          useValue: bus,
        },
      ],
    }).compile();

    appController = app.get<AlertsController>(AlertsController);
  });

  describe(proto.get.name, () => {
    it('should throw no error when command result is true', async () => {
      // Arrange
      const alertId = 'alert id';
      bus.execute = jest.fn().mockResolvedValue(true);

      // Act
      const result = await appController.get(alertId);

      // Assert
      expect(result).toBeUndefined();
      expect(bus.execute).toHaveCallsLike([expect.any(AlertStatusCommand)]);
    });

    it('should throw an error when command result is false', async () => {
      // Arrange
      const alertId = 'alert id';
      bus.execute = jest.fn().mockResolvedValue(false);
      let thrownError: any;

      // Act
      try {
        await appController.get(alertId);
      } catch (err) {
        thrownError = err;
      }

      // Assert
      expect(thrownError).toBeInstanceOf(InternalServerErrorException);
      expect(bus.execute).toHaveCallsLike([expect.any(AlertStatusCommand)]);
    });
  });
});
