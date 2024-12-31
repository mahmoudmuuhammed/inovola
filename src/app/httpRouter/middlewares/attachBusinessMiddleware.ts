import { BusinessRepoFactory } from './../../modules/business/application/repositories/business/businessRepoFactory';
import { businessSymbols } from './../../modules/business/symbols';
import { ForbiddenError } from './../../../common/errors/forbidden.error';
import { NextFunction, Request, Response } from 'express';
import { UnitOfWorkFactory, unitOfWorkSymbols } from './../../../lib/unitOfWork';
import { Inject, Injectable } from './../../../lib/dependencyInjection';

@Injectable()
export class BusinessMiddleware {
  constructor(
    @Inject(unitOfWorkSymbols.unitOfWorkFactory)
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    @Inject(businessSymbols.businessRepoFactory)
    private readonly businessRepoFactory: BusinessRepoFactory,
  ) {}

  attach = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessId } = req.params;

      const unitOfWork = await this.unitOfWorkFactory.create();

      const entityManager = unitOfWork.getEntityManager();

      const businessRepo = this.businessRepoFactory.create(entityManager);

      const business = await unitOfWork.runInTransaction(async () => {
        return await businessRepo.findOne({ id: businessId });
      });

      if (!business) throw new ForbiddenError('Something went wrong with provided business.');

      req.business = business;

      next();
    } catch (error) {
      return next(error);
    }
  };
}
