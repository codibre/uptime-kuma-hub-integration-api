import { setTimeout } from 'timers/promises';

const NestFactory = {} as any;
const EntryPointHttpModule = {};
jest.mock('@nestjs/core', () => ({ NestFactory }));
jest.mock('@entrypoint/http/entrypoint-http.module', () => ({
  EntryPointHttpModule,
}));

describe('main file', () => {
  let app: any;
  beforeEach(() => {
    app = {
      listen: jest.fn(),
    };
    NestFactory.create = jest.fn().mockReturnValue(app);
  });

  it('should initialize EntryPointHttpModule and fluent-iterable extensions', async () => {
    require('../../src/main');
    await setTimeout(1);

    expect(
      require('@codibre/fluent-iterable').fluent([]).toObservable,
    ).toBeDefined();
    expect(NestFactory.create).toHaveCallsLike([EntryPointHttpModule]);
    expect(app.listen).toHaveCallsLike([3000]);
  });
});
