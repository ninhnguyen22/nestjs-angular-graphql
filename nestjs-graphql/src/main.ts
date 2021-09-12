import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter, InternalExceptionFilter, logger } from './config';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
const port = process.env.APP_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useGlobalFilters(new InternalExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  await app
    .listen(port)
    .then(() => {
      console.log(`🚀 App running at port ${port}`);
    })
    .catch(err => {
      logger.error(`❌  Error starting server, ${err.toString()}`, {});
    });
}

bootstrap();
