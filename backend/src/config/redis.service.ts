import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  private readonly prefix: string;

  constructor(private readonly configService: ConfigService) {
    this.prefix = this.configService.get<string>('REDIS_PREFIX') || '';

    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(this.prefix + key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(this.prefix + key, ttlSeconds, value);
    } else {
      await this.client.set(this.prefix + key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.prefix + key);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(this.prefix + key, field);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(this.prefix + key, field, value);
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.client.hdel(this.prefix + key, field);
  }

  async sadd(key: string, ...members: string[]): Promise<void> {
    await this.client.sadd(this.prefix + key, ...members);
  }

  async srem(key: string, ...members: string[]): Promise<void> {
    await this.client.srem(this.prefix + key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(this.prefix + key);
  }
}
