import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Realm } from '../realms/entities/realm.entity';
import { RealmEmbedding } from '../ai/entities/realm-embedding.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'holodesk',
  entities: [User, Profile, Realm, RealmEmbedding],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
});

export const getDataSourceOptions = (configService?: ConfigService) => ({
  type: 'postgres' as const,
  host: configService?.get('DATABASE_HOST') || process.env.DATABASE_HOST || 'localhost',
  port: parseInt(configService?.get('DATABASE_PORT') || process.env.DATABASE_PORT || '5432', 10),
  username: configService?.get('DATABASE_USERNAME') || process.env.DATABASE_USERNAME || 'postgres',
  password: configService?.get('DATABASE_PASSWORD') || process.env.DATABASE_PASSWORD || 'password',
  database: configService?.get('DATABASE_NAME') || process.env.DATABASE_NAME || 'holodesk',
  entities: [User, Profile, Realm, RealmEmbedding],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
});
