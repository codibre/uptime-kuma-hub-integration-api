import { AlertStatusCommand } from '@application/commands';
import { AlertStatusCommandHandler } from '@application/handlers';
import { AlertService } from '@domain/services';
import { Test } from '@nestjs/testing';

const proto = AlertStatusCommandHandler.prototype;

describe(AlertStatusCommandHandler.name, () => {
  let alertService: AlertService;
  let target: AlertStatusCommandHandler;

  beforeEach(async () => {
    alertService = {} as AlertService;
    const module = await Test.createTestingModule({
      providers: [
        AlertStatusCommandHandler,
        {
          provide: AlertService,
          useValue: alertService,
        },
      ],
    }).compile();

    target = module.get(AlertStatusCommandHandler);
  });

  describe(proto.execute.name, () => {
    let isOk: jest.SpyInstance;

    beforeEach(() => {
      isOk = alertService.isOk = jest.fn();
    });

    it('should return true when all alerts are ok', async () => {
      // Arrange
      isOk.mockResolvedValue(true);
      const command: AlertStatusCommand = {
        alertIds: ['1', '2', '3'],
      };

      // Act
      const result = await target.execute(command);

      // Assert
      expect(result).toBe(true);
      expect(isOk).toHaveCallsLike(['1'], ['2'], ['3']);
    });

    it('should return false when some of the alerts are not ok', async () => {
      // Arrange
      isOk.mockImplementation(async (id) => id !== '2');
      const command: AlertStatusCommand = {
        alertIds: ['1', '2', '3'],
      };

      // Act
      const result = await target.execute(command);

      // Assert
      expect(result).toBe(false);
      expect(isOk).toHaveCallsLike(['1'], ['2'], ['3']);
    });
  });
});
