import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductModule } from '../product/product.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule,JwtModule,UserModule,TypeOrmModule.forFeature([Review]),ProductModule], // Add your imports here if needed, e.g., TypeOrmModule.forFeature([Review])
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
