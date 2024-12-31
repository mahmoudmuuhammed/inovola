import { EntityManager } from 'typeorm';
import { ForbiddenError, NotFoundError } from '../../../../../common/errors';
import { AdminRepo } from '../../application/repositories/adminRepo';
import { AdminStatus } from '../../domain/adminStatus';
import {
  CreateOnePayload,
  findManyPayloadSchema,
  FindOnePayload,
  SoftDeletePayload,
  UpdateOnePayload,
  createOnePayloadSchema,
  FindManyPayload,
  findOnePayloadSchema,
  softDeletePayloadSchema,
  updateOnePayloadSchema,
  FindAdminBusinesses,
  findAdminBusinessesSchema,
} from '../../application/repositories/payloads/adminPayload';
import { Validator } from '../../../../../lib/validator';
import { AdminMapper } from './mapper/adminMapper';
import { AdminEntity } from './entities/adminEntity';
import { Admin } from '../../domain/admin';

export class AdminRepoImpl implements AdminRepo {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly adminMapper: AdminMapper,
  ) {}

  async create(input: CreateOnePayload) {
    const {
      id,
      contact,
      email,
      is_verified,
      name,
      organization_id,
      password,
      roles,
      branches,
      status,
    } = Validator.validate(createOnePayloadSchema, input);

    let adminInput: AdminEntity = {
      id,
      name,
      contact,
      is_verified,
      organization_id,
      password,
      roles,
      email: email!,
    };

    if (branches) adminInput = { ...adminInput, branches };

    if (status) adminInput = { ...adminInput, status };

    const entity = this.entityManager.create(AdminEntity, adminInput);

    const admin = await this.entityManager.save(entity);

    return this.adminMapper.map(admin);
  }

  async findOne(input: FindOnePayload) {
    const { id, contact, organization_id, with_password, relations } = Validator.validate(
      findOnePayloadSchema,
      input,
    );

    const query = this.entityManager.createQueryBuilder(AdminEntity, 'admin');

    if (contact) query.where('admin.contact = :contact', { contact });

    if (id) query.where('admin.id = :id', { id });

    if (organization_id)
      query.where('admin.organization_id = :organization_id', { organization_id });

    if (with_password) query.addSelect('admin.password');

    if (relations?.includes('organization'))
      query.leftJoinAndSelect('admin.organization', 'organization');

    if (relations?.includes('branches')) {
      query.leftJoinAndSelect('admin.branches', 'branches');
    }

    if (relations?.includes('roles')) query.leftJoinAndSelect('admin.roles', 'roles');

    const admin = await query.getOne();

    if (!admin) return null;

    return this.adminMapper.map(admin);
  }

  async updateOne(input: UpdateOnePayload) {
    const {
      id,
      draft: { status, contact, password, email, roles, branches, name },
    } = Validator.validate(updateOnePayloadSchema, input);

    const adminEntity = await this.findOne({
      id,
      relations: ['branches', 'roles'],
      with_password: true,
    });

    if (!adminEntity) throw new NotFoundError(`Admin not found.`);

    if (branches) {
      const branchesRelation = await this.entityManager
        .createQueryBuilder()
        .relation(AdminEntity, 'branches')
        .of(id)
        .loadMany();

      await this.entityManager
        .createQueryBuilder()
        .relation(AdminEntity, 'branches')
        .of(id)
        .addAndRemove(branches, branchesRelation);
    }

    if (roles) {
      const rolesRelation = await this.entityManager
        .createQueryBuilder()
        .relation(AdminEntity, 'roles')
        .of(id)
        .loadMany();

      await this.entityManager
        .createQueryBuilder()
        .relation(AdminEntity, 'roles')
        .of(id)
        .addAndRemove(roles, rolesRelation);
    }

    await this.entityManager.update(AdminEntity, { id }, {
      contact,
      status,
      password,
      email,
      name,
    } as Partial<AdminEntity>);

    const admin = await this.findOne({ id });

    return admin as Admin;
  }

  async findMany(input: FindManyPayload) {
    const { organization_id, pagination, relations, filters } = Validator.validate(
      findManyPayloadSchema,
      input,
    );

    const query = this.entityManager.createQueryBuilder(AdminEntity, 'admin');

    if (organization_id) {
      query
        .leftJoin('admin.organization', 'organizations')
        .where('organizations.id = :organization_id', { organization_id });
    }

    if (relations?.includes('roles')) {
      query.leftJoin('admin.roles', 'roles').addSelect(['roles.name']);
    }

    if (relations?.includes('branches')) {
      query
        .leftJoin('admin.branches', 'branches')
        .addSelect(['branches.name', 'branches.name_localized', 'branches.id']);
    }

    if (relations?.includes('businesses')) {
      query
        .leftJoinAndSelect('admin.organization', 'organization')
        .leftJoinAndSelect('organization.businesses', 'businesses');

      if (relations?.includes('domain')) {
        query.leftJoinAndSelect('businesses.domain', 'domain');
      }
    }

    if (filters.name)
      query.andWhere(`LOWER(admin.name) LIKE LOWER(:name)`, {
        name: `%${filters.name}%`,
      });

    if (filters.status)
      query.andWhere('admin.status = :status', { status: filters.status }).withDeleted();

    if (filters.role) query.andWhere('roles.name = :roleName', { roleName: filters.role });

    if (filters.branch) {
      const branchIds = filters.branch.split(',');
      query.andWhere('branches.id IN (:...branchId)', {
        branchId: branchIds,
      });
    }

    if (filters.business?.length) {
      query.andWhere('businesses.id IN (:...businessIds)', { businessIds: filters.business });
    }

    if (filters.business_type) {
      query.andWhere('businesses.type = :type', { type: filters.business_type });
    }

    const [admins, count] = await query
      .skip(pagination.skip)
      .take(pagination.limit)
      .orderBy('admin.created_at', 'DESC')
      .getManyAndCount();

    return {
      data: admins.map((admin) => this.adminMapper.map(admin)),
      count,
    };
  }

  async softDelete(input: SoftDeletePayload) {
    const { id } = Validator.validate(softDeletePayloadSchema, input);

    const adminEntity = await this.findOne({ id, relations: ['roles'] });

    if (!adminEntity) throw new NotFoundError(`Admin with ID ${id} not found.`);

    if (adminEntity?.roles?.[0] === 'owner')
      throw new ForbiddenError(`Admin with role "owner" cannot be removed.`);

    await this.entityManager.update(AdminEntity, { id }, { status: AdminStatus.DELETED });

    await this.entityManager.softRemove(AdminEntity, {
      id,
    });
  }

  async findAdminBusinesses(input: FindAdminBusinesses) {
    const { role, business_type } = Validator.validate(findAdminBusinessesSchema, input);

    const admins = this.entityManager
      .createQueryBuilder(AdminEntity, 'admin')
      .innerJoin('admin.roles', 'roles')
      .innerJoin('admin.organization', 'organization')
      .innerJoin('organization.businesses', 'business')
      .leftJoin('business.chatbot', 'chatbot')
      .where('roles.name = :role', { role })
      .andWhere('business.type = :business_type', { business_type })
      .select('admin.id', 'adminId')
      .addSelect('admin.name', 'adminName')
      .addSelect('admin.contact', 'adminContact')
      .addSelect('array_agg(business.id)', 'businessIds')
      .addSelect("MIN(chatbot.customization ->> 'default_language')", 'default_language')
      .groupBy('admin.id')
      .addGroupBy('admin.name')
      .addGroupBy('admin.contact')
      .getRawMany();

    return admins;
  }
}
