import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const serverConfig: { port: number } = config.get('server');

  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
