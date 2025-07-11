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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userReposirty: Repository<User>,
    private readonly jwtService: JwtService,
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

    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupUserDto.password, slat);
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

  findAll() {
    return this.userReposirty.find();
  }

  async findOne(id: number) {
    const user =await this.userReposirty.findOne({
      where: { user_id: id },

    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async generateJwt(payload: any) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
