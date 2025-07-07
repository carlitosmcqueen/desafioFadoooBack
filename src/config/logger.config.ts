import { createLogger, format, transports, Logger } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

// creo la carpeta logs si no existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const createWinstonLogger = (): Logger => {
  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      // logs en consola
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          })
        ),
      }),
      
      // logs en archivos
      new transports.File({
        filename: path.join(logsDir, 'app.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 3,
      }),
      
      // errores en archivo separado
      new transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5242880,
        maxFiles: 3,
      }),
    ],
  });
}; 