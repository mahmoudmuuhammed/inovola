import { DependencyInjectionContainer, DependencyInjectionModule } from '../dependencyInjection';
import { UnitOfWorkFactory } from './unitOfWorkFactory';
import { unitOfWorkSymbols } from './symbols';

export class UnitOfWorkModule implements DependencyInjectionModule {
  public async declareBindings(container: DependencyInjectionContainer): Promise<void> {
    container.bindToConstructor<UnitOfWorkFactory>(
      unitOfWorkSymbols.unitOfWorkFactory,
      UnitOfWorkFactory,
    );
  }
}
