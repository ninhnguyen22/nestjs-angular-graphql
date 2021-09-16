import { Injectable, PipeTransform, ArgumentMetadata, Type } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'apollo-server-express';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, {metatype}: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new ValidationError(
          `${this.formatErrors(errors)}`,
      );
    }
    return value;
  }

  private toValidate(metatype: Type<any> | undefined): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors
        .map(err => {
          for (const property in err.constraints) {
            return err.constraints[property];
          }
        })
        .join(', ');
  }
}
