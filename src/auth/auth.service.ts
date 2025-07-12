import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignUpDto } from '../user/dto/sign-up.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
constructor(private readonly userService: UserService) {}

  async validateGoogleUser(googleUser: SignUpDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    console.log(googleUser.email);
    console.log(user);
    if (user) {
      return user;
    }
    console.log(user);
    
   return await this.userService.create(googleUser);
    // return this,userService.findByEmail(googleUser.email);
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
