import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from '../../../common/errors';

export class BearerToken {
  static authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!roles.includes(req.role))
          throw new NotAuthorizeError('Not Authorized for this action', 'unauthorized');

        next();
      } catch (error) {
        return next(error);
      }
    };
  }
}
