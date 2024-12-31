import { DependencyInjectionContainer, DependencyInjectionModule } from '../dependencyInjection';
import { LoggerClient } from './loggerClient';
import { Logger } from 'pino';
import { LoggerService } from './loggerService';
import { loggerSymbols } from './symbols';

export class LoggerModule implements DependencyInjectionModule {
  public constructor() {}

  public async declareBindings(container: DependencyInjectionContainer): Promise<void> {
    container.bindToFactory<Logger>(loggerSymbols.loggerClient, LoggerClient);

    container.bindToConstructor<LoggerService>(loggerSymbols.loggerService, LoggerService);
  }
}
