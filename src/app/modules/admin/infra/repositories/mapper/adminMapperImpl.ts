import { BranchMapper } from './../../../../branch/infra/repositories/branch/mapper/branchMapper';
import { OrganizationMapper } from './../../../../organization/infra/repositories/mapper/organizationMapper';
import { Admin } from './../../../domain/admin';
import { branchSymbols } from './../../../../branch/symbols';
import { organizationSymbols } from './../../../../organization/symbols';
import { AdminEntity } from '../entities/adminEntity';
import { AdminMapper } from './adminMapper';
import { Inject, Injectable } from '../../../../../../lib/dependencyInjection';
import { Role } from '../../../domain/role';

@Injectable()
export class AdminMapperImpl implements AdminMapper {
  constructor(
    @Inject(organizationSymbols.organizationMapper)
    private readonly organizationMapper: OrganizationMapper,
    @Inject(branchSymbols.branchMapper)
    private readonly branchMapper: BranchMapper,
  ) {}

  map({
    id,
    name,
    contact,
    email,
    password,
    status,
    created_at,
    updated_at,
    deleted_at,
    organization_id,
    roles: rolesEntity,
    organization: organizationEntity,
    branches: branchesEntities,
  }: AdminEntity): Admin {
    const organization = organizationEntity
      ? this.organizationMapper.map(organizationEntity)
      : undefined;

    const branches = branchesEntities?.map((branch) => this.branchMapper.map(branch));
    const roles = rolesEntity?.map((role) => new Role(role));

    return new Admin({
      id,
      name,
      contact,
      organization: organization!,
      password,
      roles,
      organization_id,
      email:email!,
      branches: branches!,
      status: status!,
      updated_at: updated_at!,
      created_at: created_at!,
      deleted_at: deleted_at!,
    });
  }
}
