import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  VerifyPasswordOTPDto,
} from './payloads/authPayload';

export interface AuthService {
  authenticate(input: LoginDto): Promise<string>;
  forgotPassword(input: ForgotPasswordDto): Promise<{ ttl: number; message?: string }>;
  verifyOTP(input: VerifyPasswordOTPDto): Promise<void>;
  resetPassword(input: ResetPasswordDto): Promise<string>;
}
