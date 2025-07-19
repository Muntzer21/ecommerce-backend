import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Module({
  imports: [RedisModule,JwtModule,UserModule,TypeOrmModule.forFeature([Order])], // Add your entities here if needed
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
