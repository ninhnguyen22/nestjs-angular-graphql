import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { SeederModule } from './seeder.module';
import { UserSeeder } from './services/user.seeder';

dotenv.config();

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then(appContext => {
      const seeder = appContext.get(UserSeeder);
      seeder
        .seed()
        .catch(error => {
          throw error;
        })
        .finally(() => process.exit());
    })
    .catch(error => {
      throw error;
    });
}

bootstrap();
