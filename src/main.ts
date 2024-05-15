import '@codibre/fluent-iterable';
import '@fluent-iterable/rxjs';
import { NestFactory } from '@nestjs/core';
import { EntryPointHttpModule } from './entrypoint/http/entrypoint-http.module';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(EntryPointHttpModule);
  await app.listen(PORT);
}
void bootstrap();
