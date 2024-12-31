import { Branch } from './../../../../branch/domain/branch/branch';
import { AdminRoleSlug } from './../../../domain/adminRole';
import { AdminStatus } from './../../../domain/adminStatus';
import { contactSchema } from '../../../../../../common/validators';
import { Schema, SchemaType } from '../../../../../../lib/validator';
import { PaginationData } from '../../../../../../common/types';
import { Role } from '../../../domain/role';
import { BusinessType } from '../../../../business/domain/business/businessType';

// Create Schema
export const createOnePayloadSchema = Schema.object({
  id: Schema.notEmptyString().uuid(),
  name: Schema.notEmptyString(),
  contact: contactSchema,
  email: Schema.notEmptyString().email().nullable(),
  is_verified: Schema.boolean(),
  password: Schema.notEmptyString(),
  organization_id: Schema.notEmptyString(),
  roles: Schema.array(Schema.instanceof(Role)),
  status: Schema.enum(AdminStatus).optional(),
  branches: Schema.array(Schema.instanceof(Branch)).optional(),
});

// Update Schema
export const updateOnePayloadSchema = Schema.object({
  id: Schema.notEmptyString().uuid(),
  draft: createOnePayloadSchema
    .omit({ organization_id: true, id: true })
    .extend({
      status: Schema.enum(AdminStatus),
    })
    .partial(),
});

export const findOnePayloadSchema = Schema.object({
  id: Schema.notEmptyString().uuid().optional(),
  contact: contactSchema.optional(),
  organization_id: Schema.notEmptyString().optional(),
  relations: Schema.array(Schema.string()).optional(),
  with_password: Schema.boolean().optional(),
});

export const findManyPayloadSchema = Schema.object({
  organization_id: Schema.notEmptyString().uuid().optional(),
  pagination: Schema.unsafeType<PaginationData>(),
  relations: Schema.array(Schema.string()).optional(),
  filters: Schema.object({
    name: Schema.notEmptyString(),
    status: Schema.enum(AdminStatus),
    role: Schema.enum(AdminRoleSlug),
    branch: Schema.notEmptyString().uuid(),
    business: Schema.array(Schema.notEmptyString().uuid()),
    business_type: Schema.enum(BusinessType),
  }).partial(),
});

// SoftDelete Schema
export const softDeletePayloadSchema = Schema.object({
  id: Schema.notEmptyString().uuid(),
});

export const findAdminBusinessesSchema = Schema.object({
  role: Schema.enum(AdminRoleSlug),
  business_type: Schema.enum(BusinessType),
});

// DTOs
export type CreateOnePayload = SchemaType<typeof createOnePayloadSchema>;
export type UpdateOnePayload = SchemaType<typeof updateOnePayloadSchema>;
export type SoftDeletePayload = SchemaType<typeof softDeletePayloadSchema>;
export type FindOnePayload = SchemaType<typeof findOnePayloadSchema>;
export type FindManyPayload = SchemaType<typeof findManyPayloadSchema>;
export type FindAdminBusinesses = SchemaType<typeof findAdminBusinessesSchema>;
