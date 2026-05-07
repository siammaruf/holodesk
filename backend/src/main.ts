import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.MODE === 'PROD';

  const loggerLevels = isProd
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'verbose', 'debug'];

  const app = await NestFactory.create(AppModule, {
    logger: loggerLevels as any,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // CORS: support comma-separated ALLOW_ORIGINS or fall back to FRONTEND_URL
  const allowOriginsRaw = configService.get<string>('ALLOW_ORIGINS');
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
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

  const port = configService.get<number>('PORT') || 3001;
  const host = '0.0.0.0';
  await app.listen(port, host);

  logger.log(`Server is running on http://${host}:${port}`);
  logger.log(`Socket.io URL: ws://${host}:${port}`);
}
bootstrap();
