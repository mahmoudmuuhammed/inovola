import { EntityManager, QueryRunner } from 'typeorm';
import { UnitOfWork } from './unitOfWork';
import { TransactionCallback } from './transactionCallback';

export class PostgresUnitOfWork implements UnitOfWork {
  public readonly entityManager: EntityManager;

  constructor(
    private readonly queryRunner: QueryRunner,
  ) {
    this.entityManager = this.queryRunner.manager;
  }

  public async init() {
    await this.queryRunner.startTransaction();
  }

  public async commit() {
    await this.queryRunner.commitTransaction();
  }

  public async rollback() {
    await this.queryRunner.rollbackTransaction();
  }

  public async cleanUp() {
    await this.queryRunner.release();
  }

  public async runInTransaction<Result>(
    callback: TransactionCallback<Result, UnitOfWork>,
  ): Promise<Result> {
    await this.ensureConnection();

    try {
      await this.init();

      const result = await callback(this);

      await this.commit();


      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    } finally {
      await this.cleanUp();
    }
  }

  getEntityManager() {
    return this.entityManager;
  }

  private async ensureConnection() {
    if (this.queryRunner.connection.isInitialized) return;
    await this.queryRunner.connect();
  }
}
