import { Module } from '@nestjs/common';
import { MongoService } from './services/mongo.service';
import { UserSeeder } from './services/user.seeder';

@Module({
  providers: [
    MongoService,
    UserSeeder,
  ],
})
export class SeederModule {
}
