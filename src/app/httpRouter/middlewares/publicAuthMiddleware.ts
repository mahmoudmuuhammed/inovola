import { NextFunction, Request, Response } from 'express';
import { Injectable } from '../../../lib/dependencyInjection';
import { config } from '../../../config';
import { NotAuthorizeError } from '../../../common/errors';

@Injectable()
export class PublicAuthMiddleware {
  constructor() {}

  auth = (req: Request, res: Response, next: NextFunction) => {
    const header: string = req.headers['x-api-key'] as string;
    try {
      console.log(header, config.api.publicApiKey);
      if (!header || header !== config.api.publicApiKey)
        throw new NotAuthorizeError('Not authenticated', 'unauthenticated');

      next();
    } catch (error) {
      return next(error);
    }
  };
}
