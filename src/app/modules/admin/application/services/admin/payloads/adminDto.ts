import { AdminStatus } from './../../../../domain/adminStatus';
import { AdminRoleSlug } from './../../../../domain/adminRole';
import { contactSchema, pageOptionsSchema } from '../../../../../../../common/validators';
import { Schema, SchemaType } from '../../../../../../../lib/validator';
import { UnitOfWork } from '../../../../../../../lib/unitOfWork';

export const adminDraftSchema = Schema.object({
  organization_id: Schema.notEmptyString().uuid(),
  name: Schema.notEmptyString(),
  contact: contactSchema,
  email: Schema.notEmptyString().email().nullable(),
  password: Schema.notEmptyString().min(8),
  roles: Schema.array(Schema.enum(AdminRoleSlug)).length(1),
  branches: Schema.array(Schema.notEmptyString().uuid()).min(1),
});

export const createAdminSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  draft: adminDraftSchema,
});

export const getAdminSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  adminId: Schema.notEmptyString().uuid(),
  query: pageOptionsSchema.pick({ include: true }).optional(),
});

export const getAdminsSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  query: pageOptionsSchema.extend({
    organizationId: Schema.notEmptyString().uuid(),
    name: Schema.notEmptyString().optional(),
    status: Schema.enum(AdminStatus).optional(),
    role: Schema.enum(AdminRoleSlug).optional(),
    branch: Schema.notEmptyString().uuid().optional(),
  }),
});

export const updateAdminSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  adminId: Schema.notEmptyString().uuid(),
  draft: adminDraftSchema
    .omit({ organization_id: true })
    .extend({
      status: Schema.enum(AdminStatus).optional(),
      old_password: Schema.notEmptyString().optional(),
    })
    .partial(),
});

export const deleteAdminSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  adminId: Schema.notEmptyString().uuid(),
});

export const getAssignedBranchesSchema = Schema.object({
  unitOfWork: Schema.unsafeType<UnitOfWork>(),
  adminId: Schema.notEmptyString().uuid(),
});

// DTO
export type CreateAdminDto = SchemaType<typeof createAdminSchema>;
export type GetAdminDto = SchemaType<typeof getAdminSchema>;
export type GetAdminsDto = SchemaType<typeof getAdminsSchema>;
export type UpdateAdminDto = SchemaType<typeof updateAdminSchema>;
export type DeleteAdminDto = SchemaType<typeof deleteAdminSchema>;
export type GetAssignedBranchesDto = SchemaType<typeof getAssignedBranchesSchema>;
