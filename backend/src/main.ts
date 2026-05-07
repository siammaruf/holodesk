import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService();
  const nodeEnv = configService.get<string>('NODE_ENV');
  const mode = configService.get<string>('MODE');
  const isProd = nodeEnv === 'production' || mode === 'PROD';

  const loggerLevels = isProd
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'verbose', 'debug'];

  const app = await NestFactory.create(AppModule, {
    logger: loggerLevels as any,
  });

  const logger = new Logger('Bootstrap');

  // CORS: support comma-separated ALLOW_ORIGINS or fall back to FRONTEND_URL
  const allowOriginsRaw = app.get(ConfigService).get<string>('ALLOW_ORIGINS');
  const frontendUrl = app.get(ConfigService).get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const origin = allowOriginsRaw
    ? allowOriginsRaw.split(',').map((s) => s.trim())
    : frontendUrl;

  app.enableCors({
    origin,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Swagger (disabled in production)
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('HoloDesk API')
      .setDescription('HoloDesk API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
    logger.log('Swagger UI available at /docs');
  }

  const port = app.get(ConfigService).get<number>('PORT') || 3001;
  const host = '0.0.0.0';
  await app.listen(port, host);

  logger.log(`Server is running on http://${host}:${port}`);
  logger.log(`Socket.io URL: ws://${host}:${port}`);
}
bootstrap();
