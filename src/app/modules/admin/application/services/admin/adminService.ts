import { Branch } from './../../../../branch/domain/branch/branch';
import { Admin } from '../../../domain/admin';
import {
  CreateAdminDto,
  DeleteAdminDto,
  GetAdminDto,
  GetAdminsDto,
  GetAssignedBranchesDto,
  UpdateAdminDto,
} from './payloads/adminDto';

export interface AdminService {
  createAdmin(input: CreateAdminDto): Promise<Admin>;
  getAdmin(input: GetAdminDto): Promise<Admin>;
  getAdmins(input: GetAdminsDto): Promise<{ admins: Admin[]; count: number }>;
  updateAdmin(input: UpdateAdminDto): Promise<Admin>;
  deleteAdmin(input: DeleteAdminDto): Promise<void>;
  assignedBranches(input: GetAssignedBranchesDto): Promise<Branch[]>;
}
