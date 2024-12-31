import { Admin } from '../../domain/admin';
import { AdminBusinesses } from '../../domain/adminBusinesses';
import {
  CreateOnePayload,
  FindAdminBusinesses,
  FindManyPayload,
  FindOnePayload,
  SoftDeletePayload,
  UpdateOnePayload,
} from './payloads/adminPayload';

export interface AdminRepo {
  create(input: CreateOnePayload): Promise<Admin>;
  findOne(input: FindOnePayload): Promise<Admin | null>;
  findMany(input: FindManyPayload): Promise<{ data: Admin[]; count: number }>;
  updateOne(input: UpdateOnePayload): Promise<Admin>;
  softDelete(input: SoftDeletePayload): Promise<void>;
  findAdminBusinesses(input: FindAdminBusinesses): Promise<AdminBusinesses[]>;
}
