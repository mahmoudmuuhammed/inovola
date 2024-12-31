import { CustomerTokenService } from './../../modules/customer/application/services/token/customerTokenService';
import { CustomerRepoFactory } from '../../modules/customer/application/repositories/customer/customerRepoFactory';
import { customerSymbols } from './../../modules/customer/symbols';
import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from './../../../common/errors';
import { UnitOfWorkFactory, unitOfWorkSymbols } from './../../../lib/unitOfWork';
import { Inject, Injectable } from './../../../lib/dependencyInjection';
import { ForbiddenError } from '../../../common/errors/forbidden.error';
import { JwtPayload } from 'jsonwebtoken';

type JwtVerifyPayload = JwtPayload;

@Injectable()
export class StoreAuthMiddleware {
  constructor(
    @Inject(customerSymbols.customerTokenService)
    private readonly tokenService: CustomerTokenService,
    @Inject(unitOfWorkSymbols.unitOfWorkFactory)
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    @Inject(customerSymbols.customerRepoFactory)
    private readonly customerRepoFactory: CustomerRepoFactory,
  ) {}

  customers = async (req: Request, res: Response, next: NextFunction) => {
    const header: string = req.headers['authorization'] as string;
    try {
      if (!header || !header.startsWith('Bearer '))
        throw new NotAuthorizeError('Not authenticated', 'unauthenticated');
      const token = header.split('Bearer ')[1];
      let decode: JwtVerifyPayload;

      try {
        decode = this.tokenService.verifyToken(token) as JwtVerifyPayload;
      } catch (error) {
        throw new NotAuthorizeError('Invalid or expired token', 'unauthenticated');
      }

      const customerId = decode.sub as string;

      const unitOfWork = await this.unitOfWorkFactory.create();

      const entityManager = unitOfWork.getEntityManager();

      const customerRepo = this.customerRepoFactory.create(entityManager);

      const customer = await customerRepo.findOneById({ id: customerId });

      if (!customer) throw new ForbiddenError('Something went wrong with provided customer id.');

      req.customer = customer;

      next();
    } catch (error) {
      return next(error);
    }
  };
}
