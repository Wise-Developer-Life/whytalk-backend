import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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

  async validateJwtToken(token: string): Promise<JwtPayload> {
    let payload = null;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (e) {
      Logger.error(`[AuthService] validateJwtToken: ${e.message}`);
      return null;
    }

    const isPayloadValid = await this.validatePayload(payload);
    if (!isPayloadValid) {
      return null;
    }

    return payload;
  }

  // TODO: implement this method
  // just throw error if payload is invalid
  async validatePayload(payload: JwtPayload): Promise<boolean> {
    Logger.log(`[AuthService] validatePayload: ${JSON.stringify(payload)}`);
    return true;
  }
}
