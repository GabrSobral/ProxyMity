import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { WsAdapter } from '@infra/websockets/ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const wsAdapter = new WsAdapter(app);

  app.enableCors();
  app.useWebSocketAdapter(wsAdapter);

  await app.listen(3333, '0.0.0.0');
}

bootstrap();
