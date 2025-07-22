import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../user/dto/sign-up.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
constructor(private readonly userService: UserService) {}

  async validateGoogleUser(googleUser: SignUpDto) {
    const user = await this.userService.findByEmail(googleUser.email);
 
    if (user) {
      return user; // User already exists, return the existing user
    }
 
    
   return await this.userService.create(googleUser);
  }
 
}
