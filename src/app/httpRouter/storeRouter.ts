import { StorePaymentLinkController } from './../storefront/plink/api/storePlinkController';
import { StoreDriverController } from './../storefront/driver/api/storeDriverController';
import { StoreReviewController } from './../storefront/review/api/storeReviewController';
import { StoreOrderController } from './../storefront/order/api/storeOrderController';
import { StorefrontPaymentController } from './../storefront/payment/api/storefrontPaymentController';
import { customerSymbols } from './../modules/customer/symbols';
import { CustomerTokenService } from './../modules/customer/application/services/token/customerTokenService';
import { StoreCustomerController } from './../storefront/customer/api/customer/storeCustomerController';
import { StoreCustomerAddressController } from './../storefront/customer/api/address/storeCustomerAddressController';
import { StoreBranchController } from './../storefront/branch/api/storeBranchController';
import { StoreMenuController } from './../storefront/menu/api/storeMenuController';
import { StoreCouponController } from './../storefront/coupon/api/storeCouponController';
import { StoreFeedbackController } from './../storefront/feedback/api/storeFeedbackController';
import { StoreAuthController } from './../storefront/auth/api/storeAuthController';
import { storefrontSymbols } from './../storefront/symbols';
import { StoreBusinessController } from './../storefront/business/api/businessStoreController';
import { BusinessMiddleware } from './middlewares/attachBusinessMiddleware';
import { businessSymbols } from './../modules/business/symbols';
import { BusinessRepoFactory } from './../modules/business/application/repositories/business/businessRepoFactory';
import { unitOfWorkSymbols } from './../../lib/unitOfWork/symbols';
import { UnitOfWorkFactory } from './../../lib/unitOfWork/unitOfWorkFactory';
import { DependencyInjectionContainer } from './../../lib/dependencyInjection/dependencyInjectionContainer';
import { Application, Router } from 'express';
import { StoreAuthMiddleware } from './middlewares/storeAuthMiddleware';
import { CustomerRepoFactory } from './../modules/customer/application/repositories/customer/customerRepoFactory';
import { botSymbols } from '../bot/symbols';
import { StoreVisitController } from '../storefront/visit/api/storeVisitController';
import { StoreWhatsAppChatController } from '../storefront/whatsAppChat/api/storeWhatsAppChatController';
import { BotController } from '../bot/api/botController';

export class StoreRouter {
  private readonly businessRouter = Router();
  private readonly nonBusinessRouter = Router();

  private readonly basePath: string = '/storefront';
  private readonly authMiddleware: StoreAuthMiddleware;

  /** Business Middleware to attach business to request */
  private readonly businessMiddleware: BusinessMiddleware;

  constructor(
    private readonly server: Application,
    private readonly container: DependencyInjectionContainer,
  ) {
    const unitOfWorkFactory = this.container.get<UnitOfWorkFactory>(
      unitOfWorkSymbols.unitOfWorkFactory,
    );

    const businessRepoFactory = this.container.get<BusinessRepoFactory>(
      businessSymbols.businessRepoFactory,
    );

    const customerRepoFactory = this.container.get<CustomerRepoFactory>(
      customerSymbols.customerRepoFactory,
    );

    this.businessMiddleware = new BusinessMiddleware(unitOfWorkFactory, businessRepoFactory);

    const tokenService = this.container.get<CustomerTokenService>(
      customerSymbols.customerTokenService,
    );

    this.authMiddleware = new StoreAuthMiddleware(
      tokenService,
      unitOfWorkFactory,
      customerRepoFactory,
    );
  }

  registerRoutes() {
    /** Storefront Routes */
    this.registerStorefrontRoutes();

    // http://localhost:8080/storefront/:businessId/{module}
    this.server.use(
      `${this.basePath}/businesses/:businessId`,
      this.businessMiddleware.attach,
      this.businessRouter,
    );

    // http://localhost:8080/storefront/{module}
    this.server.use(`${this.basePath}`, this.nonBusinessRouter);
  }

  private registerStorefrontRoutes() {
    /** Order Controller */
    const storeOrderController = this.container.get<StoreOrderController>(
      storefrontSymbols.storeOrderController,
    );

    // Store Payment Session Route
    const storePaymentController = this.container.get<StorefrontPaymentController>(
      storefrontSymbols.storePaymentController,
    );

    // Store Payment Links Route
    const storePaymentLinkController = this.container.get<StorePaymentLinkController>(
      storefrontSymbols.storePaymentLinkController,
    );

    // Bot Controller
    const botController = this.container.get<BotController>(botSymbols.botController);

    // Store Driver Controller
    const storeDriverController = this.container.get<StoreDriverController>(
      storefrontSymbols.storeDriverController,
    );

    // Store Review
    const storeReviewController = this.container.get<StoreReviewController>(
      storefrontSymbols.storeReviewController,
    );

    // Store Business
    const storeBusinessController = this.container.get<StoreBusinessController>(
      storefrontSymbols.storeBusinessController,
    );

    // Store Auth
    const storeAuthController = this.container.get<StoreAuthController>(
      storefrontSymbols.storeAuthController,
    );

    // Store Feedback
    const storeFeedbackController = this.container.get<StoreFeedbackController>(
      storefrontSymbols.storeFeedbackController,
    );

    // Store Coupon
    const storeCouponController = this.container.get<StoreCouponController>(
      storefrontSymbols.storeCouponController,
    );

    // Store Menu
    const storeMenuController = this.container.get<StoreMenuController>(
      storefrontSymbols.storeMenuController,
    );

    // Store Branch
    const storeBranchController = this.container.get<StoreBranchController>(
      storefrontSymbols.storeBranchController,
    );

    // Store Customer
    const storeCustomerController = this.container.get<StoreCustomerController>(
      storefrontSymbols.storeCustomerController,
    );

    // Store Visit Links Route
    const storeVisitController = this.container.get<StoreVisitController>(
      storefrontSymbols.storeVisitController,
    );

    // Store Customer Address
    const storeCustomerAddressController = this.container.get<StoreCustomerAddressController>(
      storefrontSymbols.storeCustomerAddressController,
    );

    const storeWhatsAppChatController = this.container.get<StoreWhatsAppChatController>(
      storefrontSymbols.storeWhatsAppChatController,
    );

    // All Routes injection
    this.businessRouter.use(storeMenuController.router);
    this.nonBusinessRouter.use(storePaymentController.router);
    this.nonBusinessRouter.use(storePaymentLinkController.router);
    this.nonBusinessRouter.use(botController.router);
    this.nonBusinessRouter.use(storeDriverController.router);
    this.nonBusinessRouter.use(storeReviewController.router);
    this.nonBusinessRouter.use(storeBusinessController.router);
    this.nonBusinessRouter.use(storeAuthController.router);
    this.nonBusinessRouter.use(storeCustomerController.router);
    this.businessRouter.use(storeFeedbackController.router);
    this.businessRouter.use(storeCouponController.router);
    this.businessRouter.use(storeBranchController.router);
    this.businessRouter.use(storeVisitController.router);
    this.businessRouter.use(storeOrderController.router);
    this.businessRouter.use(storeWhatsAppChatController.router);

    /* Here all the routing that require customer token, customer must be authenticated */
    this.businessRouter.use(this.authMiddleware.customers);
    this.nonBusinessRouter.use(this.authMiddleware.customers);

    this.businessRouter.use(storeCouponController.authRouter);
    this.businessRouter.use(storeBranchController.authRouter);
    this.nonBusinessRouter.use(storeCustomerAddressController.router);
    this.nonBusinessRouter.use(storeOrderController.authRouter);
    this.nonBusinessRouter.use(storeCustomerController.authorizedRouter);
  }
}
