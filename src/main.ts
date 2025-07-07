import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);
  
  app.useLogger(logger);
  
  logger.log('Iniciando app', 'Bootstrap');
  
  // habilito CORS para que el frontend pueda conectarse
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  logger.log('✅ CORS enabled', 'Bootstrap');

  // validacion global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  logger.log('✅ Global validation pipe configured', 'Bootstrap');

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);
  
  logger.log(`App corriendo en puerto ${port}`);
  logger.log('Endpoint: POST /chat/chatgpt');
}

bootstrap().catch(error => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});
