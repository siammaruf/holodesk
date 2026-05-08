import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const allowOriginsRaw = process.env.ALLOW_ORIGINS;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const origin = allowOriginsRaw
      ? allowOriginsRaw.split(',').map((s) => s.trim())
      : frontendUrl;

    return super.createIOServer(port, {
      ...options,
      cors: {
        origin,
        credentials: true,
      },
    });
  }
}

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.MODE === 'PROD';

  const app = await NestFactory.create(AppModule, {
    logger: isProd ? ['error', 'warn'] : ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  const configService = app.get(ConfigService);

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
  app.useWebSocketAdapter(new CustomIoAdapter(app));
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
  }

  const port = configService.get<number>('PORT') || 3001;
  const host = '::';
  await app.listen(port, host);

  const startupMsg = `Server is running on http://${host}:${port} | Socket.io: ws://${host}:${port}`;
  if (isProd) {
    // eslint-disable-next-line no-console
    console.log(startupMsg);
  } else {
    const logger = new Logger('Bootstrap');
    logger.log(startupMsg);
    logger.log('Swagger UI available at /docs');
  }
}
bootstrap();
