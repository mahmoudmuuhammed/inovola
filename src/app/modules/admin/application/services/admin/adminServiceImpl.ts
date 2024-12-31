import { Branch } from './../../../../branch/domain/branch/branch';
import { OrganizationService } from './../../../../organization/application/services/organizationService';
import { BranchRepoFactory } from './../../../../branch/application/repositories/branch/branchRepoFactory';
import { branchSymbols } from './../../../../branch/symbols';
import { AdminStatus } from './../../../domain/adminStatus';
import { UuidGenerator } from './../../../../../../lib/uuid/uuidGenerator';
import { organizationSymbols } from '../../../../organization/symbols';
import { BadRequestError, NotFoundError } from '../../../../../../common/errors';
import { Inject, Injectable } from '../../../../../../lib/dependencyInjection';
import { adminSymbols } from '../../../symbols';
import { AdminRepoFactory } from '../../repositories/adminRepoFactory';
import {
  CreateAdminDto,
  DeleteAdminDto,
  GetAdminDto,
  GetAdminsDto,
  GetAssignedBranchesDto,
  UpdateAdminDto,
  createAdminSchema,
  deleteAdminSchema,
  getAdminSchema,
  getAdminsSchema,
  getAssignedBranchesSchema,
  updateAdminSchema,
} from './payloads/adminDto';
import { AdminService } from './adminService';
import { Hashing, Pagination } from '../../../../../../common/helpers';
import { AdminRole, AdminRoleSlug } from '../../../domain/adminRole';
import { Validator } from '../../../../../../lib/validator';
import { Role } from '../../../domain/role';
import { UpdateOnePayload } from '../../repositories/payloads/adminPayload';
import { Admin } from '../../../domain/admin';

@Injectable()
export class AdminServiceImpl implements AdminService {
  constructor(
    @Inject(adminSymbols.adminRepoFactory)
    private adminRepoFactory: AdminRepoFactory,
    @Inject(organizationSymbols.organizationService)
    private organizationService: OrganizationService,
    @Inject(branchSymbols.branchRepoFactory)
    private branchRepoFactory: BranchRepoFactory,
  ) {}

  async createAdmin(input: CreateAdminDto) {
    const { unitOfWork, draft } = Validator.validate(createAdminSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const checkContact = await adminRepo.findOne({
      contact: draft.contact,
      relations: ['organizations'],
    });

    if (checkContact) throw new BadRequestError('Contact already exist.');

    await this.organizationService.findOrganization({
      orgId: draft.organization_id,
      unitOfWork,
    });

    const hashingPassword = await Hashing.encrypt(draft.password);

    const branchRepo = this.branchRepoFactory.create(entityManager);

    const branches = await branchRepo.findByIds({ ids: draft.branches });

    if (branches.length === 0) throw new BadRequestError('Must assign at least one branch');

    const roles = [
      new Role({
        id: AdminRole[draft?.roles[0]],
        name: AdminRoleSlug[draft?.roles[0].toUpperCase()],
      }),
    ];

    const admin = await adminRepo.create({
      ...draft,
      id: UuidGenerator.generateUuid(),
      email:draft.email!,
      password: hashingPassword,
      is_verified: true,
      status: AdminStatus.ACTIVE,
      roles,
      organization_id: draft.organization_id,
      branches,
    });

    return admin;
  }

  async getAdmin(input: GetAdminDto) {
    const { unitOfWork, adminId, query } = Validator.validate(getAdminSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const relations = query?.include?.split(',');

    const user = await adminRepo.findOne({ id: adminId, relations });

    if (!user) throw new NotFoundError(`Admin not found`);

    return user;
  }

  async updateAdmin(input: UpdateAdminDto) {
    const { unitOfWork, adminId, draft } = Validator.validate(updateAdminSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const admin = await adminRepo.findOne({
      id: adminId,
      with_password: true,
      relations: ['branches', 'roles'],
    });

    if (!admin) throw new NotFoundError('Admin not found with this id');

    const checkContact = await adminRepo.findOne({
      contact: draft.contact,
    });

    if (checkContact?.contact === draft.contact && checkContact?.id !== admin.id)
      throw new BadRequestError('Contact already exist.');

    const updateData: UpdateOnePayload = {
      id: admin.id,
      draft: {},
    };

    // Password is Partial update, if provided will update it.
    if (draft.password && draft.old_password) {
      const checkPassword = await Hashing.compare(draft.old_password!, admin.password!);

      if (!checkPassword) throw new BadRequestError(`Old password is incorrect`);

      updateData.draft.password = await Hashing.encrypt(draft.password);
    }

    // Update roles
    if (draft.roles) {
      updateData.draft.roles = [
        new Role({
          id: AdminRole[draft?.roles[0]],
          name: AdminRoleSlug[draft?.roles[0].toUpperCase()],
        }),
      ];
    }

    // Update branches
    if (draft.branches) {
      const branchRepo = this.branchRepoFactory.create(entityManager);
      const branches = await branchRepo.findByIds({ ids: draft.branches });
      updateData.draft.branches = branches;
    }

    // Update status
    if (draft.status) updateData.draft.status = draft.status;

    // Update Branches
    updateData.draft = {
      ...updateData.draft,
      contact: draft.contact,
      email: draft.email!,
      name: draft.name,
    };

    await adminRepo.updateOne(updateData);

    return (await adminRepo.findOne({
      id: adminId,
      relations: ['branches', 'roles'],
    })) as Admin;
  }

  async getAdmins(input: GetAdminsDto) {
    const { unitOfWork, query } = Validator.validate(getAdminsSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    const pagination = Pagination.build(query);

    const relations = query?.include?.split(',');

    const { data, count } = await adminRepo.findMany({
      organization_id: query.organizationId,
      pagination,
      relations,
      filters: query,
    });

    return { admins: data, count };
  }

  async deleteAdmin(input: DeleteAdminDto) {
    const { unitOfWork, adminId } = Validator.validate(deleteAdminSchema, input);

    const entityManager = unitOfWork.getEntityManager();

    const adminRepo = this.adminRepoFactory.create(entityManager);

    await adminRepo.softDelete({ id: adminId });
  }

  async assignedBranches(input: GetAssignedBranchesDto) {
    const { unitOfWork, adminId } = Validator.validate(getAssignedBranchesSchema, input);

    const admin = await this.getAdmin({
      unitOfWork,
      adminId,
      query: { include: 'branches,roles' },
    });

    if (admin.roles?.[0] !== AdminRoleSlug.OWNER) {
      return admin.branches || [];
    }

    const organization = await this.organizationService.findOrganization({
      unitOfWork,
      orgId: admin.organization_id,
      query: { include: 'businesses.branches' },
    });

    let branches: Branch[] = [];

    for (let business of organization.businesses) {
      branches = branches.concat(business.branches!);
    }

    return branches;
  }
}
