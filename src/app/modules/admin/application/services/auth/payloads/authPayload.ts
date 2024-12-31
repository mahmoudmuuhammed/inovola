import { contactSchema } from './../../../../../../../common/validators';
import { Schema, SchemaType } from '../../../../../../../lib/validator';
import { UnitOfWork } from '../../../../../../../lib/unitOfWork';

export const loginSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  draft: Schema.object({
    contact: contactSchema,
    password: Schema.notEmptyString(),
  }),
});

export const forgotPasswordSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  draft: Schema.object({
    contact: contactSchema,
  }),
});

export const verifyPasswordOTPSchema = Schema.object({
  draft: Schema.object({
    otp: Schema.notEmptyString().length(6),
    contact: contactSchema,
  }),
});

export const resetPasswordSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  draft: Schema.object({
    contact: contactSchema,
    password: Schema.notEmptyString().min(8),
  }),
});

// DTOs
export type LoginDto = SchemaType<typeof loginSchema>;
export type ForgotPasswordDto = SchemaType<typeof forgotPasswordSchema>;
export type VerifyPasswordOTPDto = SchemaType<typeof verifyPasswordOTPSchema>;
export type ResetPasswordDto = SchemaType<typeof resetPasswordSchema>;
