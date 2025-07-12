import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthService } from '../auth.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService,private readonly authService: AuthService) {
    super({
      clientID: config.get<string>('CLIENT_ID'),
      clientSecret: config.get<string>('CLIENT_SECRET'),
      callbackURL: config.get<string>('CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    // const user = await this.authService.validateGoogleUser({
    //   email: profile.emails[0].value,
    //   username: profile.name.givenName,
    //   password: "",
    // });
    // done(null, user);
    console.log('Google Profile:', profile);
    return profile;
    // done(null, profile);
  }
}
