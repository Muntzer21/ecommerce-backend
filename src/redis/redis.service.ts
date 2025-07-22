import { Injectable } from '@nestjs/common';
import { CreateRediDto } from './dto/create-redi.dto';
import { UpdateRediDto } from './dto/update-redi.dto';
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

  create(createRediDto: CreateRediDto) {
    return 'This action adds a new redi';
  }

  findAll() {
    return `This action returns all redis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redi`;
  }

  update(id: number, updateRediDto: UpdateRediDto) {
    return `This action updates a #${id} redi`;
  }

  remove(id: number) {
    return `This action removes a #${id} redi`;
  }
}
