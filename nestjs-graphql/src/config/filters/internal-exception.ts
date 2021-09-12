import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(Error)
export class InternalExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    return new HttpException([exception], HttpStatus.FORBIDDEN);
  }
}
