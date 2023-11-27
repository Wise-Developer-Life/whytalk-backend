import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './auth.type';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AUTH_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const isPayloadValid = await this.authService.validatePayload(payload);

    if (!isPayloadValid) {
      throw new Error('Invalid token payload');
    }

    Logger.log(`[JwtAuthStrategy] payload: ${JSON.stringify(payload)}`);
    return payload;
  }
}
