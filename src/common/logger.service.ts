import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { createWinstonLogger } from '../config/logger.config';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createWinstonLogger();
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // metodo para logs del chat
  logChat(userMessage: string, response: string) {
    this.logger.info('Chat procesado', {
      userMessage,
      response: response.substring(0, 30) + '...',
    });
  }
} 