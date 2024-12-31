import { Request, Response, NextFunction, Router } from 'express';
import { ResponseBuilder } from '../../../../common/helpers';
import { adminSymbols } from '../symbols';
import { HttpStatusCode } from '../../../../common/types';
import { UnitOfWorkFactory, unitOfWorkSymbols } from '../../../../lib/unitOfWork';
import { AuthService } from '../application/services/auth/authService';
import { Inject, Injectable } from '../../../../lib/dependencyInjection';
import { HttpController } from '../../../../common/http/httpController';

@Injectable()
export class AuthController implements HttpController {
  public readonly basePath: string = '/auth';
  public readonly router: Router = Router();

  constructor(
    @Inject(adminSymbols.authService)
    private readonly authService: AuthService,
    @Inject(unitOfWorkSymbols.unitOfWorkFactory)
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
  ) {
    this.router.post(`${this.basePath}/login`, this.login);

    this.router.post(`${this.basePath}/forgot-password`, this.forgotPassword);

    this.router.post(`${this.basePath}/otp`, this.verifyOTP);

    this.router.post(`${this.basePath}/reset-password`, this.resetPassword);
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.authService.authenticate({ unitOfWork, draft: req.body });
      });

      const response = ResponseBuilder.json({ token: payload });

      res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.authService.forgotPassword({ unitOfWork, draft: req.body });
      });

      const response = ResponseBuilder.json(payload);

      res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.verifyOTP({ draft: req.body });
      res.status(HttpStatusCode.noContent).json(null);
    } catch (error) {
      return next(error);
    }
  };

  private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.authService.resetPassword({ unitOfWork, draft: req.body });
      });

      const response = await ResponseBuilder.json({ token: payload });

      res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
