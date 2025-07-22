import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // button click then request this end point
  //http://localhost:3000/api/v1/auth/google/login
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth login' })
  googleLogin() {
    // return 'google login successful';
  }

  // http://localhost:3000/api/v1/auth/google/callback
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiQuery({
    name: 'token',
    required: false,
    description: 'JWT token returned as query param',
  })
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    // const response = await this.userService.login(req.user.user_id);
    // console.log(req.user);
    // console.log(req.user.user_id);
    // console.log(res);
    const access_token = await this.userService.generateJwt({
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
}
