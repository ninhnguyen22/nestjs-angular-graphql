import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoService {
  private getConnectionUrl() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_DATABASE;
    // return `mongodb://${username}:${password}@${host}:${port}/${database}`;
    return `mongodb://${host}:${port}/${database}`;
  }

  private getConnectionOption() {
    return {
      server:
        {
          socketOptions:
            {
              socketTimeoutMS: 3600000,
              connectTimeoutMS: 3600000,
            },
        },
      useNewUrlParser: true,
    };
  }

  async makeDocument(collection, data): Promise<boolean> {

    const connectionUrl = this.getConnectionUrl();
    const options = this.getConnectionOption();

    return new Promise((resolve, reject) => {
      MongoClient.connect(connectionUrl, options, async (connectionErr, client) => {

        if (connectionErr) {
          console.log('Connection Error: ', connectionErr);
          reject(connectionErr);
        }

        const db = client.db(process.env.DB_DATABASE);
        db.collection(collection).insertMany(data)
          .then(res => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }
}
