import { Logger } from 'pino';
import { inject, injectable } from 'inversify';
import { loggerSymbols } from './symbols';

type LoggerPayload = Readonly<{
  message?: string;
  context?: Record<string, unknown>;
}>;

// Logger Service Wrapper.
@injectable()
export class LoggerService {
  constructor(@inject(loggerSymbols.loggerClient) private readonly loggerClient: Logger) {}

  public fatal(payload: LoggerPayload) {
    this.loggerClient.fatal({ context: payload.context ?? {} }, payload.message);
  }

  public error(payload: LoggerPayload) {
    this.loggerClient.error({ context: payload.context ?? {} }, payload.message);
  }

  public warn(payload: LoggerPayload) {
    this.loggerClient.warn({ context: payload.context ?? {} }, payload.message);
  }

  public info(payload: LoggerPayload) {
    this.loggerClient.info({ context: payload.context ?? {} }, payload.message);
  }

  public debug(payload: LoggerPayload) {
    this.loggerClient.debug({ context: payload.context ?? {} }, payload.message);
  }
}
