import { RequestValidationError } from './../../common/errors';
import { Schema } from 'zod';

export class Validator {
  public static validate<T>(schema: Schema<T>, input: T): T {
    const result = schema.safeParse(input);
    if (!result.success) {
      throw new RequestValidationError(result.error);
    }

    return result.data;
  }
}
