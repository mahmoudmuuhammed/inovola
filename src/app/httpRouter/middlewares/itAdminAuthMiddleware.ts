import { itAdminSymbols } from './../../it/admin/symbols';
import { ITAdminTokenService } from './../../it/admin/application/services/token/tokenService';
import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from './../../../common/errors';
import { Inject, Injectable } from './../../../lib/dependencyInjection';
import { JwtPayload } from 'jsonwebtoken';

type JwtVerifyPayload = JwtPayload & { roles: string[] };

@Injectable()
export class ITAdminAuthMiddleware {
  constructor(
    @Inject(itAdminSymbols.itAdminTokenService)
    private readonly tokenService: ITAdminTokenService,
  ) {}

  itAdmins = (req: Request, res: Response, next: NextFunction) => {
    const header: string = req.headers['authorization'] as string;

    if (!header || !header.startsWith('Bearer '))
      throw new NotAuthorizeError('Not authenticated', 'unauthenticated');
    const token = header.split('Bearer ')[1];

    try {
      const decode = this.tokenService.verifyToken(token) as JwtVerifyPayload;

      if (!decode) throw new NotAuthorizeError('Not authenticated', 'unauthenticated');

      req.adminId = decode.sub as string;
      req.role = decode.roles[0];

      next();
    } catch (error) {
      throw new NotAuthorizeError('Invalid or expired token', 'unauthenticated');
    }
  };
}
