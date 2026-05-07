import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { GameGateway } from './game.gateway';
import { SessionsModule } from '../sessions/sessions.module';
import { RealmsModule } from '../realms/realms.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    SessionsModule,
    RealmsModule,
    ProfilesModule,
    UsersModule,
  ],
  providers: [GameGateway],
})
export class SocketModule {}
