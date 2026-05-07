import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RealmsModule } from './realms/realms.module';
import { SessionsModule } from './sessions/sessions.module';
import { SocketModule } from './socket/socket.module';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    RedisModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    RealmsModule,
    SessionsModule,
    SocketModule,
    AiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
