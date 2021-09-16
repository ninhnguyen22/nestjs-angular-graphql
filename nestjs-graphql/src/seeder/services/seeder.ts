import { Injectable } from '@nestjs/common';
import { MongoService } from './mongo.service';

@Injectable()
export abstract class Seeder {
  public constructor(private mongoService: MongoService) {
  }

  abstract collection(): string;

  abstract data(): any[];

  async seed() {
    const collection = this.collection();
    const data = this.data();
    return this.mongoService
      .makeDocument(collection, data)
      .then(res => console.log('Insert document Successfully.'))
      .catch(err => console.log('Insert document Fail: ', err.toString()));
  }

}
