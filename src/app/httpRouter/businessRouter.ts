import { importSymbols } from './../modules/import/symbols';
import { ImportController } from './../modules/import/api/importController';
import { handlerSymbols } from './../handlers/symbols';
import { HandlerController } from './../handlers/controllers/handlerController';
import { waFormOrdersSymbols } from './../waForm/order/symbols';
import { WAFormOrderController } from './../waForm/order/api/waFormOrderController';
import { OrderStatusController } from './../modules/order/api/orderStatusController';
import { reviewSymbols } from './../modules/review/symbols';
import { ReviewController } from './../modules/review/api/reviewController';
import { analyticsSymbols } from './../modules/analytics/symbols';
import { AnalyticsController } from './../modules/analytics/api/analyticsController';
import { orderSymbols } from './../modules/order/symbols';
import { OrderController } from '../modules/order/api/orderController';
import { systemLogSymbols } from './../modules/system-log/symbols';
import { SystemLogController } from './../modules/system-log/api/systemLogController';
import { businessSymbols } from './../modules/business/symbols';
import { BusinessRepoFactory } from './../modules/business/application/repositories/business/businessRepoFactory';
import { thirdPartySymbols } from './../it/thirdParty/symbols';
import { ThirdPartyController } from './../it/thirdParty/api/thirdPartyController';
import { orderingChannelSymbols } from './../waForm/orderingChannel/symbols';
import { OrderingChannelController } from './../waForm/orderingChannel/api/orderingChannelController';
import { cartSettingsSymbols } from '../waForm/cartSetting/symbols';
import { CartSettingController } from '../waForm/cartSetting/api/cartSetting/cartSettingController';
import { feedbackSymbols } from '../waForm/feedback/symbols';
import { FeedbackController } from '../waForm/feedback/api/feedbackController';
import { Application, Router } from 'express';
import { customerSymbols } from '../modules/customer/symbols';
import { CustomerController } from '../modules/customer/api/customerController';
import { CouponController } from '../modules/coupon/api/couponController';
import { couponSymbols } from '../modules/coupon/symbols';
import { complaintSymbols } from '../modules/complaint/symbols';
import { ComplaintController } from '../modules/complaint/api/complaintController';
import { deliveryZoneSymbols } from '../modules/deliveryZone/symbols';
import { DeliveryZoneController } from '../modules/deliveryZone/api/deliveryZoneController';
import { productSymbols } from '../modules/product/symbols';
import { ProductController } from '../modules/product/api/productController';
import { OptionController } from '../modules/option/api/optionController';
import { optionSymbols } from '../modules/option/symbols';
import { modifierSymbols } from '../modules/modifier/symbols';
import { ModifierController } from '../modules/modifier/api/modifierController';
import { GroupController } from '../modules/group/api/groupController';
import { groupSymbols } from '../modules/group/symbols';
import { categorySymbols } from '../modules/category/symbols';
import { CategoryController } from '../modules/category/api/categoryController';
import { BranchController } from '../modules/branch/api/branchController';
import { branchSymbols } from '../modules/branch/symbols';
import { BusinessController } from '../modules/business/api/business/businessController';
import { organizationSymbols } from '../modules/organization/symbols';
import { OrganizationController } from '../modules/organization/api/organizationController';
import { DriverController } from '../modules/driver/api/driverController';
import { driverSymbols } from '../modules/driver/symbols';
import { AdminController } from '../modules/admin/api/adminController';
import { AuthController } from '../modules/admin/api/authController';
import { onboardingSymbols } from '../modules/onboarding/symbols';
import { OnboardingController } from '../modules/onboarding/api/onboardingController';
import { UnitOfWorkFactory, unitOfWorkSymbols } from '../../lib/unitOfWork';
import { TokenService } from '../modules/admin/application/services/token/tokenService';
import { adminSymbols } from '../modules/admin/symbols';
import { DependencyInjectionContainer } from '../../lib/dependencyInjection';
import { config } from '../../config';
import { BusinessMiddleware } from './middlewares/attachBusinessMiddleware';
import { AuthMiddleware } from './middlewares/authMiddleware';
import { IntegrationController } from '../modules/integration/api/integrationController';
import { integrationSymbols } from '../modules/integration/symbols';
import { CampaignController } from '../modules/campaign/api/campaignController';
import { campaignSymbols } from '../modules/campaign/symbols';
import { WAFormAnalyticsController } from '../waForm/analytics/api/analyticsController';
import { waFromAnalyticsSymbols } from '../waForm/analytics/symbols';
import { ReportController } from '../modules/report/api/reportController';
import { reportSymbols } from '../modules/report/symbols';
import { WhatsAppChatController } from '../modules/whatsAppChat/api/whatsAppChatController';
import { whatsAppChatSymbols } from '../modules/whatsAppChat/symbols';
import { CustomerAddressController } from '../modules/customer/api/customerAddressController';
import { SubscriptionController } from '../modules/subscription/api/subscriptionController';
import { subscriptionSymbols } from '../modules/subscription/symbols';
import { IntegrationMiddleware } from './middlewares/attachIntegrationMiddleware';
import { PublicController } from '../public/controllers/publicController';
import { publicSymbols } from '../public/symbols';
import { PublicAuthMiddleware } from './middlewares/publicAuthMiddleware';
import { AsapController } from '../plugins/asap/api/asapController';
import { pluginsSymbols } from '../plugins/symbols';

export class BusinessRouter {
  /** Root Path for API */
  private readonly rootPath: string = config.api.prefix;
  /** Business Middleware to attach business to request */
  private readonly businessMiddleware: BusinessMiddleware;
  /** Auth Middle for admin merchants */
  private readonly authMiddleware: AuthMiddleware;
  /** Integration Middleware to get the type */
  private readonly integrationMiddleware: IntegrationMiddleware;
  /** Public Auth Middleware for public access routes */
  private readonly publicAuthMiddleware: PublicAuthMiddleware;
  /** Business Router Fields */
  private readonly businessRouter: Router = Router();
  private readonly nonBusinessRouter: Router = Router();
  /** Public Router */
  private readonly publicRouter: Router = Router();

  public constructor(
    private readonly server: Application,
    private readonly container: DependencyInjectionContainer,
  ) {
    const unitOfWorkFactory = this.container.get<UnitOfWorkFactory>(
      unitOfWorkSymbols.unitOfWorkFactory,
    );

    const businessRepoFactory = this.container.get<BusinessRepoFactory>(
      businessSymbols.businessRepoFactory,
    );

    const tokenService = this.container.get<TokenService>(adminSymbols.tokenService);

    this.authMiddleware = new AuthMiddleware(tokenService);

    this.businessMiddleware = new BusinessMiddleware(unitOfWorkFactory, businessRepoFactory);
    this.integrationMiddleware = new IntegrationMiddleware();

    this.publicAuthMiddleware = new PublicAuthMiddleware();
  }

  public registerRoutes() {
    /** Business Routes */
    this.registerBusinessRoutes();

    // http://localhost:8080/api/v1/businesses/:businessId/{module}
    this.server.use(
      `${this.rootPath}/v1/businesses/:businessId`,
      this.authMiddleware.admins,
      this.businessMiddleware.attach,
      this.integrationMiddleware.attach,
      this.businessRouter,
    );

    // http://localhost:8080/api/v1/public/{module}
    this.server.use(
      `${this.rootPath}/v1/public`,
      this.publicAuthMiddleware.auth,
      this.publicRouter,
    );

    // http://localhost:8080/api/v1/{module}
    this.server.use(`${this.rootPath}/v1`, this.nonBusinessRouter);
  }

  private registerBusinessRoutes() {
    // Public Routes
    const publicController = this.container.get<PublicController>(publicSymbols.publicController);

    this.publicRouter.use(publicController.router);

    // App Functions
    const handlerController = this.container.get<HandlerController>(
      handlerSymbols.handlerController,
    );

    this.nonBusinessRouter.use(handlerController.router);

    // Onboarding Routes
    const onboardingController = this.container.get<OnboardingController>(
      onboardingSymbols.onboardingController,
    );

    this.nonBusinessRouter.use(onboardingController.router);

    // Auth Routes
    const authController = this.container.get<AuthController>(adminSymbols.authController);

    this.nonBusinessRouter.use(authController.router);

    // non-authorized Orders routes
    const orderController = this.container.get<OrderController>(orderSymbols.orderController);

    this.nonBusinessRouter.use(orderController.nonAuthRouter);

    /** Auth Middleware */
    this.nonBusinessRouter.use(this.authMiddleware.admins);

    // Plugin Routes
    const asapController = this.container.get<AsapController>(pluginsSymbols.asapController);

    this.nonBusinessRouter.use(asapController.router);

    // Admin Routes
    const adminController = this.container.get<AdminController>(adminSymbols.adminController);

    this.nonBusinessRouter.use(adminController.router);

    // Available Third Parties
    const thirdPartyController = this.container.get<ThirdPartyController>(
      thirdPartySymbols.thirdPartyController,
    );

    this.nonBusinessRouter.use(thirdPartyController.availableRouter);

    // Driver Routes
    const driverController = this.container.get<DriverController>(driverSymbols.driverController);

    this.nonBusinessRouter.use(driverController.router);

    // Organization Routes
    const organizationController = this.container.get<OrganizationController>(
      organizationSymbols.organizationController,
    );

    this.nonBusinessRouter.use(organizationController.router);

    // Business Routes
    const businessController = this.container.get<BusinessController>(
      businessSymbols.businessController,
    );

    this.nonBusinessRouter.use(businessController.router);

    // Authorized Orders Routes
    this.nonBusinessRouter.use(orderController.router);

    // Order status Routes
    const orderStatusController = this.container.get<OrderStatusController>(
      orderSymbols.orderStatusController,
    );

    this.nonBusinessRouter.use(orderStatusController.router);

    // Customers Routes
    const customerController = this.container.get<CustomerController>(
      customerSymbols.customerController,
    );

    this.nonBusinessRouter.use(customerController.router);

    // Branch Routes
    const branchController = this.container.get<BranchController>(branchSymbols.branchController);

    this.businessRouter.use(branchController.router);

    // Category Routes
    const categoryController = this.container.get<CategoryController>(
      categorySymbols.categoryController,
    );

    this.businessRouter.use(categoryController.router);

    // Menu Group Routes
    const groupController = this.container.get<GroupController>(groupSymbols.groupController);

    this.businessRouter.use(groupController.router);

    // Modifiers Routes
    const modifierController = this.container.get<ModifierController>(
      modifierSymbols.modifierController,
    );

    this.businessRouter.use(modifierController.router);

    // Modifier Options Routes
    const optionController = this.container.get<OptionController>(optionSymbols.optionController);

    this.businessRouter.use(optionController.router);

    // Product Routes
    const productController = this.container.get<ProductController>(
      productSymbols.productController,
    );

    this.businessRouter.use(productController.router);

    // Delivery Zone Routes
    const zoneController = this.container.get<DeliveryZoneController>(
      deliveryZoneSymbols.deliveryZoneController,
    );

    this.businessRouter.use(zoneController.router);

    // Complaints Routes
    const complaintController = this.container.get<ComplaintController>(
      complaintSymbols.complaintController,
    );

    this.businessRouter.use(complaintController.router);

    // Discount Coupon Routes
    const couponController = this.container.get<CouponController>(couponSymbols.couponController);

    this.businessRouter.use(couponController.router);

    // Customers Address Routes
    const customerAddressController = this.container.get<CustomerAddressController>(
      customerSymbols.customerAddressController,
    );

    this.businessRouter.use(customerAddressController.router);

    // Feedback Routes
    const feedbackController = this.container.get<FeedbackController>(
      feedbackSymbols.feedbackController,
    );

    this.businessRouter.use(feedbackController.router);

    // Cart Setting Routes
    const cartSettingController = this.container.get<CartSettingController>(
      cartSettingsSymbols.cartSettingController,
    );

    this.businessRouter.use(cartSettingController.router);

    // Ordering Channels
    const orderingChannelController = this.container.get<OrderingChannelController>(
      orderingChannelSymbols.orderingChannelController,
    );

    this.businessRouter.use(orderingChannelController.router);

    // System Log Routes
    const systemLogController = this.container.get<SystemLogController>(
      systemLogSymbols.systemLogController,
    );

    this.businessRouter.use(systemLogController.router);

    // Import Feature Route
    const importController = this.container.get<ImportController>(importSymbols.importController);

    this.businessRouter.use(importController.router);

    // Review Routes
    const reviewController = this.container.get<ReviewController>(reviewSymbols.reviewController);

    this.businessRouter.use(reviewController.router);

    // Business Analytics
    const analyticsController = this.container.get<AnalyticsController>(
      analyticsSymbols.analyticsController,
    );

    this.businessRouter.use(analyticsController.router);

    // WAForm Business Analytics
    const waFormAnalyticsController = this.container.get<WAFormAnalyticsController>(
      waFromAnalyticsSymbols.analyticsController,
    );

    this.businessRouter.use(waFormAnalyticsController.router);

    // Integration
    const integrationController = this.container.get<IntegrationController>(
      integrationSymbols.integrationController,
    );

    this.businessRouter.use(integrationController.router);

    // Campaign
    const campaignController = this.container.get<CampaignController>(
      campaignSymbols.campaignController,
    );

    this.businessRouter.use(campaignController.router);

    // WA Form Orders
    const waFormOrderController = this.container.get<WAFormOrderController>(
      waFormOrdersSymbols.waFormOrderController,
    );

    this.businessRouter.use(waFormOrderController.router);

    // Reports
    const reportController = this.container.get<ReportController>(reportSymbols.reportController);

    this.businessRouter.use(reportController.router);

    // WhatsApp Chat
    const whatsAppChatController = this.container.get<WhatsAppChatController>(
      whatsAppChatSymbols.whatsAppChatController,
    );

    this.businessRouter.use(whatsAppChatController.router);

    // Subscription
    const subscriptionController = this.container.get<SubscriptionController>(
      subscriptionSymbols.subscriptionController,
    );
    this.businessRouter.use(subscriptionController.router);
  }
}
