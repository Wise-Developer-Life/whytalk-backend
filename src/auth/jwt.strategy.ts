import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AUTH_SECRET'),
    });
  }

  async validate(payload: any) {
    Logger.log(`[JwtAuthStrategy] payload: ${JSON.stringify(payload)}`);
    return payload;
  }
}
