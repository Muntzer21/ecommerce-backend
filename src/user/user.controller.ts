import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Authen } from './guards/authen.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UserType } from 'src/utils/user-type';
import { Roles } from './decorators/user-role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signup(signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @Get('current-user')
  @UseGuards(Authen)
  current(@CurrentUser() user) {
    console.log('Current User:', user);
    return this.userService.findOne(user.id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch()
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  update(@CurrentUser() currentUser, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(currentUser.id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
