import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  extractTokenFromAuthHeader(authHeader: string): string {
    const tokens = authHeader.split(' ');
    if (tokens.length !== 2 && tokens[0] != 'Bearer') {
      return null;
    }
    return tokens[1];
  }

  async generateJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async validateJwtToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return this.validatePayload(payload);
    } catch (e) {
      return false;
    }
  }

  // TODO: implement this method
  // just throw error if payload is invalid
  async validatePayload(payload: JwtPayload): Promise<boolean> {
    Logger.log(`[AuthService] validatePayload: ${JSON.stringify(payload)}`);
    return true;
  }
}
