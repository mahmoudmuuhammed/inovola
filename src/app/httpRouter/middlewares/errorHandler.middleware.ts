import { LoggerService } from './../../../lib/logger/loggerService';
import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../../../common/errors';
import { HttpStatusCode } from '../../../common/types';

/** Error handler middleware that handle custom global error.
 */
export const errorHandler = (logger: LoggerService) => {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error({
      message: `[Request Error] - ${req.protocol}://${req.hostname}${req.originalUrl}`,
      context: { error, headers: req.headers, body: req.body, query: req.query },
    });

    if (error instanceof BaseError) {
      return res.status(error.statusCode).json({
        ...error.serializeError(),
      });
    }

    return res.status(HttpStatusCode.badRequest).json({
      name: 'Internal Server Error',
      message: error.message,
    });
  };
};
