import { Inject, Injectable } from './../dependencyInjection';
import { DataSource } from 'typeorm';
import { databaseSymbols } from './../postgres/symbols';
import { UnitOfWork } from './unitOfWork';
import { PostgresUnitOfWork } from './postgresUnitOfWork';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @Inject(databaseSymbols.dataSource)
    private dataSource: DataSource,
  ) {}

  public async create(): Promise<UnitOfWork> {
    const queryRunner = this.dataSource.createQueryRunner();

    return new PostgresUnitOfWork(queryRunner);
  }
}
