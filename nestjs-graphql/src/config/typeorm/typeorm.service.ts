import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_DATABASE;
    // const url = `mongodb://${username}:${password}@${host}:${port}/${database}`;
    const url = `mongodb://${host}:${port}/${database}`;
    return {
      type: 'mongodb',
      url,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      useNewUrlParser: true,
      logging: true,
    };
  }
}
