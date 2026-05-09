import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
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

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
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

  const displayHost = isProd ? host : 'localhost';
  const serverUrl = `http://${displayHost}:${port}`;
  const socketUrl = `ws://${displayHost}:${port}`;
  const swaggerUrl = `${serverUrl}/docs`;

  // ANSI helpers
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    white: '\x1b[37m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
  };
  const link = (url: string, text: string) => `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;

  const lines = [
    `${c.white}${c.bold}Server${c.reset}    ${c.green}${link(serverUrl, serverUrl)}${c.reset}`,
    `${c.white}${c.bold}Socket${c.reset}    ${c.cyan}${link(socketUrl, socketUrl)}${c.reset}`,
    `${c.white}${c.bold}Swagger${c.reset}   ${c.yellow}${link(swaggerUrl, swaggerUrl)}${c.reset}`,
  ];

  if (isProd) {
    // eslint-disable-next-line no-console
    lines.forEach((l) => console.log(l));
  } else {
    const logger = new Logger('Bootstrap');
    lines.forEach((l) => logger.log(l));
  }
}
bootstrap();
