import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    Logger.log(
      `[GoogleOAuthStrategy] configService: ${configService.get(
        'GOOGLE_CLIENT_ID',
      )}`,
    );
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `http://localhost:${configService.get(
        'APP_PORT',
      )}/auth/google/callback`,
      scope: ['profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    done(null, profile);
  }
}
