import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
// import { Response } from 'supertest';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly userService: UserService) {}

  // button click then request this end point
  //http://localhost:3000/api/v1/auth/google/login
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // return 'google login successful';
  }

  // http://localhost:3000/api/v1/auth/google/callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res : Response) {
    // const response = await this.userService.login(req.user.user_id);
    // console.log(req.user);
    // console.log(req.user.user_id);
    // console.log(res);
    const  access_token = await this.userService.generateJwt({
      user_id: req.user.user_id,
      email: req.user.email,
      role: req.user.roles,
    }); // Get the access token from your authService

    // Determine your frontend URL dynamically or from config
    const frontendUrl = 'http://localhost:3000/api/v1/auth/home'; // Example: Assuming your frontend runs on port 4200 (Angular) or 3000 (React/Next.js)

    // Option A: Pass token as query parameter (simpler for quick setup)
    // frontend will extract 'token' from the URL: http://your-frontend.com/auth-callback?token=YOUR_JWT
  // return  res.redirect(`${frontendUrl}`);
  return res.redirect(`${frontendUrl}?token=${access_token}`);
  }
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('home')
  findAll() {
    return 'hi hasony';
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
