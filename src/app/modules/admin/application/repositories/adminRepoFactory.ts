import { EntityManager } from 'typeorm';
import { AdminRepo } from './adminRepo';

export interface AdminRepoFactory {
  create(entityManager: EntityManager): AdminRepo;
}
