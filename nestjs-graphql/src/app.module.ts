import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  CacheService,
  GraphqlService,
  TypeOrmService,
} from './config';
import { NotificationModule, UserModule } from './modules';
import { Upload } from './config/graphql/scalars';
import { Unique } from './config/validator';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    NotificationModule,
  ],
  providers: [
    Unique,
    Upload,
  ],
})
export class AppModule {

}
