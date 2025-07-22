import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis.Redis;

  constructor() {
    
    this.redisClient = new Redis.Redis({
      host: 'localhost', // Replace with your Redis host
      port: 6379, // Replace with your Redis port
    });
  }

  get client(): Redis.Redis {
    return this.redisClient;
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }


}
