import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { createWinstonLogger } from '../config/logger.config';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createWinstonLogger();
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  // metodo para logs del chat
  logChat(userMessage: string, response: string) {
    this.logger.info('Chat procesado', {
      userMessage,
      response: response.substring(0, 30) + '...',
    });
  }
} 