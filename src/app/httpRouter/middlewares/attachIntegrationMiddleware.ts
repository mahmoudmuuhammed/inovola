import { NextFunction, Request, Response } from 'express';
import { Injectable } from '../../../lib/dependencyInjection';
import { IntegrationRequestQuery } from '../../modules/integration/api/payloads/integrationControllerPayloads';

@Injectable()
export class IntegrationMiddleware {
  constructor() {}

  attach = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { integrationType, integrationName } = req.query;

      req.integrations = {
        name: integrationName as IntegrationRequestQuery['name'],
        type: integrationType as IntegrationRequestQuery['type'],
      };

      next();
    } catch (error) {
      return next(error);
    }
  };
}
