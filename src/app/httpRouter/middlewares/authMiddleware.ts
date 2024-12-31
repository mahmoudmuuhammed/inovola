import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from './../../modules/admin/application/services/token/tokenService';
import { adminSymbols } from './../../modules/admin/symbols';
import { NotAuthorizeError } from './../../../common/errors';
import { Inject, Injectable } from './../../../lib/dependencyInjection';

type JwtVerifyPayload = JwtPayload & { roles: string[] };

@Injectable()
export class AuthMiddleware {
  constructor(
    @Inject(adminSymbols.tokenService)
    private readonly tokenService: TokenService,
  ) {}

  admins = (req: Request, res: Response, next: NextFunction) => {
    const header: string = req.headers['authorization'] as string;

    if (!header || !header.startsWith('Bearer '))
      throw new NotAuthorizeError('Not authenticated', 'unauthenticated');

    const token = header.split('Bearer ')[1];

    try {
      const decode = this.tokenService.verifyToken(token) as JwtVerifyPayload;

      req.adminId = decode.sub as string;
      req.role = decode.roles[0];

      next();
    } catch (error) {
      throw new NotAuthorizeError('Invalid or expired token', 'unauthenticated');
    }
  };
}
