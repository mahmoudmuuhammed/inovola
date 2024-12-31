import { DependencyInjectionContainer } from './dependencyInjectionContainer';
import { DependencyInjectionModule } from './dependencyInjectionModule';

export class DependencyInjectionContainerFactory {
  public static create(modules: DependencyInjectionModule[]) {
    const container = new DependencyInjectionContainer();
    // Modules will be here
    for (const module of modules) {
      module.declareBindings(container);
    }

    return container;
  }
}
