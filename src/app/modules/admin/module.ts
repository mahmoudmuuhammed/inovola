import {
  DependencyInjectionContainer,
  DependencyInjectionModule,
} from './../../../lib/dependencyInjection';
import { adminSymbols } from './symbols';
import { AdminRepoFactory } from './application/repositories/adminRepoFactory';
import { AdminRepoFactoryImpl } from './infra/repositories/adminRepoFactoryImpl';
import { AdminServiceImpl } from './application/services/admin/adminServiceImpl';
import { AdminService } from './application/services/admin/adminService';
import { AdminController } from './api/adminController';
import { AuthService } from './application/services/auth/authService';
import { AuthServiceImpl } from './application/services/auth/authServiceImpl';
import { AuthController } from './api/authController';
import { AdminMapper } from './infra/repositories/mapper/adminMapper';
import { AdminMapperImpl } from './infra/repositories/mapper/adminMapperImpl';
import { TokenService } from './application/services/token/tokenService';
import { TokenServiceImpl } from './application/services/token/tokenServiceImpl';

export class AdminModule implements DependencyInjectionModule {
  declareBindings(container: DependencyInjectionContainer) {
    container.bindToConstructor<TokenService>(adminSymbols.tokenService, TokenServiceImpl);
    container.bindToConstructor<AdminMapper>(adminSymbols.adminMapper, AdminMapperImpl);

    container.bindToConstructor<AdminRepoFactory>(
      adminSymbols.adminRepoFactory,
      AdminRepoFactoryImpl,
    );

    container.bindToConstructor<AdminService>(adminSymbols.adminService, AdminServiceImpl);

    container.bindToConstructor<AuthService>(adminSymbols.authService, AuthServiceImpl);

    container.bindToConstructor<AdminController>(adminSymbols.adminController, AdminController);

    container.bindToConstructor<AuthController>(adminSymbols.authController, AuthController);
  }
}
