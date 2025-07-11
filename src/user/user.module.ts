import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION'),
        },
      };
    },
  }),],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
