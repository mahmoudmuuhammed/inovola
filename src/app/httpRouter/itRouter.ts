import { thirdPartySymbols } from './../it/thirdParty/symbols';
import { ThirdPartyController } from './../it/thirdParty/api/thirdPartyController';
import { ITAdminController } from './../it/admin/api/admin/itAdminController';
import { ITAuthController } from './../it/admin/api/auth/itAuthController';
import { itAdminSymbols } from './../it/admin/symbols';
import { ITAdminTokenService } from './../it/admin/application/services/token/tokenService';
import { Application, Router } from 'express';
import { DependencyInjectionContainer } from './../../lib/dependencyInjection/dependencyInjectionContainer';
import { ITAdminAuthMiddleware } from './middlewares/itAdminAuthMiddleware';
import { ITUserController } from '../it/business/api/user/itUserControllers';
import { itBusinessSymbols } from '../it/business/symbols';
import { ITBusinessController } from '../it/business/api/business/itBusinessController';
import { ITAnalyticsController, itAnalyticsSymbols } from '../it/analytics';
import { integrationSymbols } from '../modules/integration/symbols';
import { SubscriptionPlanController } from '../modules/subscription/api/subscriptionPlanController';
import { subscriptionSymbols } from '../modules/subscription/symbols';
import { IntegrationController } from '../modules/integration/api/integrationController';
import { IntegrationMiddleware } from './middlewares/attachIntegrationMiddleware';

export class ItAdminRouter {
  private readonly router: Router = Router();
  private readonly basePath: string = '/api/it';
  private readonly authMiddleware: ITAdminAuthMiddleware;
  private readonly integrationMiddleware: IntegrationMiddleware;

  constructor(
    private readonly server: Application,
    private readonly container: DependencyInjectionContainer,
  ) {
    const tokenService = this.container.get<ITAdminTokenService>(
      itAdminSymbols.itAdminTokenService,
    );

    this.authMiddleware = new ITAdminAuthMiddleware(tokenService);
    this.integrationMiddleware = new IntegrationMiddleware();
  }

  registerRoutes() {
    this.registerITRoutes();

    // http://localhost:8080/api/it/{module}
    this.server.use(`${this.basePath}`, this.router);
  }

  private registerITRoutes() {
    // IT Auth routes
    const itAuthController = this.container.get<ITAuthController>(itAdminSymbols.itAuthController);
    this.router.use(itAuthController.router);

    /** Auth middleware for IT Admin */
    this.router.use(this.authMiddleware.itAdmins);
    this.router.use(this.integrationMiddleware.attach);

    // IT Admin routes
    const itAdminController = this.container.get<ITAdminController>(
      itAdminSymbols.itAdminController,
    );

    this.router.use(itAdminController.router);

    // IT Third Party routes
    const thirdPartyController = this.container.get<ThirdPartyController>(
      thirdPartySymbols.thirdPartyController,
    );

    this.router.use(thirdPartyController.router);

    // IT User routes
    const itUserController = this.container.get<ITUserController>(
      itBusinessSymbols.itUserController,
    );

    this.router.use(itUserController.router);

    // IT Business routes
    const itBusinessController = this.container.get<ITBusinessController>(
      itBusinessSymbols.itBusinessController,
    );
    this.router.use(itBusinessController.router);

    // IT Analytics routes
    const itAnalyticsController = this.container.get<ITAnalyticsController>(
      itAnalyticsSymbols.itAnalyticsController,
    );
    this.router.use(itAnalyticsController.router);

    // IT Integration
    const integrationController = this.container.get<IntegrationController>(
      integrationSymbols.integrationController,
    );
    this.router.use(integrationController.router);

    // IT Subscription Plan
    const subscriptionPlanController = this.container.get<SubscriptionPlanController>(
      subscriptionSymbols.subscriptionPlanController,
    );
    this.router.use(subscriptionPlanController.router);
  }
}
