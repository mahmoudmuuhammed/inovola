import { Injectable } from './../dependencyInjection/decorators';
import pino, { Logger } from 'pino';

@Injectable()
export class LoggerClient {
  constructor() {}

  public create(): Logger {
    let pinoConfig = {
      name: 'salver',
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    };

    let pinoLogger = pino(pinoConfig);

    return pinoLogger;
  }
}
