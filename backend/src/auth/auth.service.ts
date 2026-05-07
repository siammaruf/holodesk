import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { User } from '../users/entities/user.entity';

interface GoogleUserInput {
  googleId: string;
  email: string;
  username: string;
  avatarUrl: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateGoogleUser(input: GoogleUserInput): Promise<User> {
    let user = await this.usersService.findByGoogleId(input.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(input.email);
    }

    if (!user) {
      user = await this.usersService.create({
        email: input.email,
        username: input.username,
        avatar_url: input.avatarUrl,
        google_id: input.googleId,
      });
      await this.profilesService.create(user.id);
    }

    return user;
  }

  signToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '7d',
    });
  }

  getCookieOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }
}
