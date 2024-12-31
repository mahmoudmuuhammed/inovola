import { Injectable } from './../../../../../../lib/dependencyInjection';
import { TokenService } from './tokenService';
import jwt from 'jsonwebtoken';
import { config } from '../../../../../../config';

@Injectable()
export class TokenServiceImpl implements TokenService {
  createToken(roles: string[], tenantId: string): string {
    return jwt.sign({ roles }, config.jwt.secret as string, {
      subject: tenantId,
      expiresIn: config.jwt.portalExpiration,
      algorithm: config.jwt.algorithm,
    });
  }

  verifyToken(token: string): Record<string, string> {
    return jwt.verify(token, config.jwt.secret) as Record<string, string>;
  }

  createVisitToken(): string {
    return jwt.sign({ id: Date.now() }, config.jwt.secret as string);
  }
}
