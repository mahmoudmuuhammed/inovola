import { DependencyInjectionContainer } from '../dependencyInjection';
import { DependencyInjectionModule } from './../dependencyInjection/dependencyInjectionModule';
import { DataSource, EntityManager } from 'typeorm';
import { DbContext } from './dbContext';
import { databaseSymbols } from './symbols';

export class DbContextModule implements DependencyInjectionModule {
  declareBindings(container: DependencyInjectionContainer) {
    container.bindToFactory<DataSource>(databaseSymbols.dataSource, DbContext);

    container.bindToDynamicValue<EntityManager>(databaseSymbols.entityManager, ({ container }) => {
      const dataSource: DataSource = container.get(databaseSymbols.dataSource);

      return dataSource.manager;
    });
  }
}
