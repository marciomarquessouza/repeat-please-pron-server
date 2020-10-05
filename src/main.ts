import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const serverConfig: { port: number } = config.get('server');

  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
