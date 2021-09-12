import {
  Injectable,
  CacheOptionsFactory,
  CacheModuleOptions,
} from '@nestjs/common';

@Injectable()
export class CacheService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      /* seconds */
      ttl: 5,
      /* maximum number of items in cache */
      max: 10,
    };
  }
}
