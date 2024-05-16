import 'jest-callslike';
import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@core/core.module';

describe(CoreModule.name, () => {
  let target: TestingModule;

  beforeEach(async () => {
    target = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();
  });

  it('should inject all expected core interfaces', async () => {
    expect(target).not.toBeNull();
  });
});
