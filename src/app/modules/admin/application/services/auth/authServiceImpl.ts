import { MessageLanguage } from './../../../../../../providers/mux/services/payloads/muxDto';
import { InternalServerError } from './../../../../../../common/errors/internalServer.error';
import { cacheSymbols } from './../../../../../../lib/redis/symbols';
import { adminSymbols } from '../../../symbols';
import { BadRequestError, NotFoundError } from '../../../../../../common/errors';
import { Hashing, generateOTP, RedisService } from '../../../../../../common/helpers';
import { AdminRepoFactory } from '../../repositories/adminRepoFactory';
import { Inject, Injectable } from '../../../../../../lib/dependencyInjection';
import { AuthService } from './authService';
import { AdminStatus } from '../../../domain/adminStatus';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyPasswordOTPDto,
  LoginDto,
  loginSchema,
  forgotPasswordSchema,
} from './payloads/authPayload';
import { config } from '../../../../../../config';
import { Validator } from '../../../../../../lib/validator';
import { TokenService } from '../token/tokenService';
import { integrationSymbols } from '../../../../integration/symbols';
import { MessagingIntegrationService } from '../../../../integration/application/services/messaging/messagingIntegrationService';
import { SendIntegrationMessagePayload } from '../../../../integration/application/services/messaging/payloads/messagingIntegrationDto';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(adminSymbols.adminRepoFactory)
    private adminRepoFactory: AdminRepoFactory,
    @Inject(adminSymbols.tokenService)
    private readonly tokenService: TokenService,
    @Inject(cacheSymbols.redisService)
    private readonly redisService: RedisService,
    @Inject(integrationSymbols.messagingIntegrationService)
    private readonly messagingService: MessagingIntegrationService,
  ) {}

  async authenticate(input: LoginDto) {
    const { unitOfWork, draft } = Validator.validate(loginSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const checkAccount = await adminRepo.findOne({
      contact: draft.contact,
      with_password: true,
      relations: ['roles'],
    });

    if (!checkAccount) throw new NotFoundError('Invalid Credentials.');

    const verifyPassword = await Hashing.compare(draft.password, checkAccount.password!);

    if (!verifyPassword) throw new NotFoundError('Invalid Credentials.');

    if (checkAccount.status !== AdminStatus.ACTIVE)
      throw new BadRequestError('This account not active, contact the owner');

    const token = this.tokenService.createToken([checkAccount.roles?.[0]!], checkAccount.id!);

    return token;
  }

  async forgotPassword(input: ForgotPasswordDto) {
    const { unitOfWork, draft } = Validator.validate(forgotPasswordSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const admin = await adminRepo.findOne({ contact: draft.contact });

    if (!admin || admin.status !== AdminStatus.ACTIVE)
      throw new NotFoundError('Cannot found admin with this contact');

    const key = `${config.otp.prefix}${draft.contact}`;

    const checkOTP = await this.redisService.getOTP(key);

    if (checkOTP !== null) {
      const ttl = await this.redisService.getTTl(key);
      return {
        ttl,
        message: 'TRIGGERED',
      };
    }

    const token = generateOTP();

    const messagePayload: SendIntegrationMessagePayload = {
      recipient: draft.contact,
      language: MessageLanguage.EN,
      template_id: config.mux.otp_template,
      template_args: [token],
    };

    await this.messagingService.sendMessage({ draft: messagePayload });

    try {
      await this.redisService.saveOTP(key, token);

      return { ttl: config.otp.expiration };
    } catch (error) {
      throw new InternalServerError('There was some problem generating the OTP');
    }
  }

  async verifyOTP(input: VerifyPasswordOTPDto) {
    const { draft } = input;

    const key = `${config.otp.prefix}${draft.contact}`;

    const checkOTP = await this.redisService.getOTP(key);

    if (checkOTP === null || checkOTP === undefined || checkOTP !== draft.otp)
      throw new BadRequestError('Invalid OTP');
  }

  async resetPassword(input: ResetPasswordDto) {
    const { unitOfWork, draft } = input;

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const admin = await adminRepo.findOne({
      contact: draft.contact,
      with_password: true,
    });

    if (!admin || admin.status !== AdminStatus.ACTIVE)
      throw new NotFoundError('Admin not found with this contact');

    if (admin.status !== AdminStatus.ACTIVE) throw new BadRequestError('Account not active');

    const password = await Hashing.encrypt(draft.password);

    await adminRepo.updateOne({ id: admin.id, draft: { password } });

    const token = this.tokenService.createToken([admin.roles?.[0]!], admin.id!);

    return token;
  }
}
