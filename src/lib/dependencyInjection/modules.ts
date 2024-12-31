import { HandlersModule } from './../../app/handlers/module';
import { SocketModule } from './../socket/module';
import { WebhookModule } from './../../app/webhooks/module';
import { QueueProviderModule } from './../queue/queueProviderModule';
import { StorePaymentLinkModule } from './../../app/storefront/plink/module';
import { StoreDriverModule } from '../../app/storefront/driver/module';
import { AnalyticsModule } from './../../app/modules/analytics/module';
import { ProviderModule } from './../../providers/module';
import { StoreReviewModule } from './../../app/storefront/review/module';
import { StoreOrderModule } from './../../app/storefront/order/module';
import { ReportModule } from './../../app/modules/report/module';
import { StorefrontPaymentModule } from './../../app/storefront/payment/module';
import { GoogleMapModule } from './../googleMap/module';
import { ThirdPartyModule } from './../../app/it/thirdParty/module';
import { ComplaintModule } from './../../app/modules/complaint/module';
import { OrderingChannelModule } from './../../app/waForm/orderingChannel/module';
import { CartSettingsModule } from './../../app/waForm/cartSetting/module';
import { FeedbackModule } from './../../app/waForm/feedback/module';
import { WAFormCustomerModule } from './../../app/waForm/customer/module';
import { WAFormOrdersModule } from './../../app/waForm/order/module';
import { StoreCustomerModule } from './../../app/storefront/customer/module';
import { StoreBranchModule } from './../../app/storefront/branch/module';
import { FileHandlerModule } from './../fileHandler/fileHandlerModule';
import { DateModule } from './../date/dateModule';
import { StoreMenuModule } from './../../app/storefront/menu/module';
import { StoreCouponModule } from './../../app/storefront/coupon/module';
import { StoreFeedbackModule } from './../../app/storefront/feedback/module';
import { StoreAuthModule } from './../../app/storefront/auth/module';
import { StoreBusinessModule } from './../../app/storefront/business/module';
import { ReviewModule } from './../../app/modules/review/module';
// IT Modules
import { ITAdminModule } from './../../app/it/admin/module';
// Dashboard Modules
import { UploadingModule } from './../uploading/uploadingModule';
import { BranchModule } from './../../app/modules/branch/module';
import { CouponModule } from './../../app/modules/coupon/module';
import { GroupModule } from './../../app/modules/group/module';
import { CategoryModule } from './../../app/modules/category/module';
import { BusinessModule } from './../../app/modules/business/module';
import { AdminModule } from './../../app/modules/admin/module';
import { ModifierModule } from '../../app/modules/modifier/module';
import { OnboardingModule } from '../../app/modules/onboarding/module';
import { OptionModule } from '../../app/modules/option/module';
import { OrganizationModule } from '../../app/modules/organization/module';
import { DeliveryZoneModule } from '../../app/modules/deliveryZone/module';
import { ProductModule } from '../../app/modules/product/module';
import { UnitOfWorkModule } from '../unitOfWork/unitOfWorkModule';
import { DbContextModule } from '../postgres/dbContextModule';
import { RedisModule } from '../redis/redisModule';
import { LoggerModule } from '../logger/loggerModule';
import { CustomerModule } from './../../app/modules/customer/module';
import { DriverModule } from '../../app/modules/driver/module';
import { OrderModule } from '../../app/modules/order/module';
import { BotModule } from '../../app/bot/module';
import { ITBusinessModule } from '../../app/it/business/module';
import { ITAnalyticsModule } from '../../app/it/analytics';
import { SystemLogModule } from '../../app/modules/system-log/module';
import { VisitModule } from '../../app/waForm/visit/module';
import { IntegrationModule } from '../../app/modules/integration/module';
import { CampaignModule } from '../../app/modules/campaign/module';
import { WAFormAnalyticsModule } from '../../app/waForm/analytics/module';
import { StoreVisitModule } from '../../app/storefront/visit/module';
import { WhatsAppChatModule } from '../../app/modules/whatsAppChat/module';
import { StoreWhatsAppChatModule } from '../../app/storefront/whatsAppChat/module';
import { ImportModule } from '../../app/modules/import/module';
import { FirebaseFcmModule } from '../../lib/firebase/module';
import { PrintModule } from '../print/printModule';
import { SubscriptionModule } from '../../app/modules/subscription/module';
import { PublicModule } from '../../app/public/module';
import { PluginsModule } from '../../app/plugins/module';
import { ClientsModule } from '../../app/clients/module';

export const modules = [
  new QueueProviderModule(),
  new DateModule(),
  new PrintModule(),
  new SocketModule(),
  new HandlersModule(),
  new LoggerModule(),
  new DbContextModule(),
  new GoogleMapModule(),
  new FirebaseFcmModule(),
  new FileHandlerModule(),
  new RedisModule(),
  new UnitOfWorkModule(),
  new UploadingModule(),
  new AdminModule(),
  new BranchModule(),
  new BusinessModule(),
  new CategoryModule(),
  new GroupModule(),
  new ModifierModule(),
  new OnboardingModule(),
  new OptionModule(),
  new CustomerModule(),
  new OrganizationModule(),
  new ProductModule(),
  new CouponModule(),
  new DeliveryZoneModule(),
  new DriverModule(),
  new OrderModule(),
  new ComplaintModule(),
  new FeedbackModule(),
  new ReviewModule(),
  new CartSettingsModule(),
  new WAFormOrdersModule(),
  new WAFormCustomerModule(),
  new OrderingChannelModule(),
  new SystemLogModule(),
  new VisitModule(),
  new ReportModule(),
  new ProviderModule(),
  new AnalyticsModule(),
  new IntegrationModule(),
  new CampaignModule(),
  new WAFormAnalyticsModule(),
  new WebhookModule(),
  new ClientsModule(),
  new WhatsAppChatModule(),
  new SubscriptionModule(),
  // IT Modules
  new ITAdminModule(),
  new ThirdPartyModule(),
  new ITBusinessModule(),
  new ITAnalyticsModule(),
  //Storefront Modules
  new StoreBusinessModule(),
  new StoreAuthModule(),
  new StorefrontPaymentModule(),
  new StoreFeedbackModule(),
  new StoreCouponModule(),
  new StoreMenuModule(),
  new StoreBranchModule(),
  new StoreCustomerModule(),
  new StoreOrderModule(),
  new StoreReviewModule(),
  new StoreDriverModule(),
  new StorePaymentLinkModule(),
  new StoreVisitModule(),
  new StoreWhatsAppChatModule(),
  new ImportModule(),
  // Bot Modules
  new BotModule(),
  // Public Modules
  new PublicModule(),
  // Plugins
  new PluginsModule(),
];
