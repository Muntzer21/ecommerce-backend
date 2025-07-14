import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userReposirty: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    // private readonly emailService: EmailService,
  ) {}

  /**
   * to sign up a new user
   * @param signupUserDto body of the request
   * @returns new user in DB
   */
  async signup(signupUserDto: SignUpDto) {
    const user = await this.userReposirty.findOne({
      where: { email: signupUserDto.email },
    });

    if (user) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(signupUserDto.password);
    signupUserDto.password = hashedPassword;

    let newUser = this.userReposirty.create(signupUserDto);

    newUser = await this.userReposirty.save(newUser);
    delete newUser.password;

    const accessToken = await this.generateJwt({
      id: newUser.user_id,
      email: newUser.email,
      role: newUser.roles,
    });
    return { accessToken };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userReposirty
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: signInDto.email })
      .getOne();

    if (!user) {
      throw new BadRequestException('This user not exists');
    }

    const isPasswordMatched = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('password not matched');
    }
    delete user.password;

    const accessToken = await this.generateJwt({
      id: user.user_id,
      email: user.email,
      role: user.roles,
    });


    return { accessToken};
  }

  async login(id : number) {
    const user = await this.userReposirty.findOne({
      where: { user_id : id},
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const accessToken = await this.generateJwt({
      id: user.user_id,
      email: user.email,
      role: user.roles,
    });

    return { accessToken };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userReposirty.create(createUserDto);
    return await this.userReposirty.save(user);
  }

  findAll() {
    return this.userReposirty.find();
  }

  async findOne(id: number) {
    const userCache  = await this.redisService.client.get(`user:${id}`);
    if (userCache) {
      return JSON.parse(userCache); // Return cached user if exists
    } else {
      const user = await this.userReposirty.findOne({
        where: { user_id: id },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }
      await this.redisService.client.set(
        `user:${id}`,
        JSON.stringify(user),
        'EX',
        60,
      ); // Cache for 60 seconds
      return user;
    }
    

    
  }

  async findByEmail(email: string) {
    const user = await this.userReposirty.findOne({
      where: { email },
    });
    // if (!user) {
    //   throw new BadRequestException('User not found');
    // }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    user.username = updateUserDto.username ?? user.username;
    if (updateUserDto.password) {
      user.password = await this.hashPassword(updateUserDto.password);
    }

    return await this.userReposirty.save(user);
  }

  async remove(id: number) {
    await this.userReposirty.delete(id);
    return { message: 'User deleted successfully' };
  }

   async generateJwt(payload: any) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
