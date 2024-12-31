export interface TokenService {
  createToken(roles: string[], tenantId: string): string;
  verifyToken(token: string): Record<string, string>;
  createVisitToken(): string;
}
