import { NextFunction, Request, Response } from 'express';

export const attachLocale = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.locale =
      req.headers?.['accept-language']! || req.cookies?.locale || req.query?.locale || 'en';

    return next();
  } catch (error) {
    return next(error);
  }
};
