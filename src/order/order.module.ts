import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderProuctsDto } from './dto/order-products.dto';
import { OrdersProducts } from './entities/order.products.entity';
import { Shipping } from './entities/shipping.entity';
import { ProductModule } from 'src/product/product.module';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [JwtModule,UserModule,TypeOrmModule.forFeature([Order,OrdersProducts,Shipping,Product]),ProductModule], // Add your entities here if needed
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
