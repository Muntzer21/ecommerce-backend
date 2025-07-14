import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [JwtModule,TypeOrmModule.forFeature([Category]),UserModule,RedisModule], // Add your entities here if needed
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
