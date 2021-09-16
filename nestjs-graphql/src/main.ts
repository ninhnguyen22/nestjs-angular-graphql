import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { logger, ValidationPipe } from './config';
import { useContainer } from 'class-validator';

dotenv.config();
const port = process.env.APP_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe());

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
