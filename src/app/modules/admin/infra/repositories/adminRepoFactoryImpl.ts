import { EntityManager } from 'typeorm';
import { Inject, Injectable } from '../../../../../lib/dependencyInjection';
import { AdminRepo } from '../../application/repositories/adminRepo';
import { AdminRepoFactory } from '../../application/repositories/adminRepoFactory';
import { AdminRepoImpl } from './adminRepoImpl';
import { adminSymbols } from '../../symbols';
import { AdminMapper } from './mapper/adminMapper';

@Injectable()
export class AdminRepoFactoryImpl implements AdminRepoFactory {
  constructor(
    @Inject(adminSymbols.adminMapper)
    private readonly adminMapper: AdminMapper,
  ) {}

  create(entityManager: EntityManager): AdminRepo {
    return new AdminRepoImpl(entityManager, this.adminMapper);
  }
}
