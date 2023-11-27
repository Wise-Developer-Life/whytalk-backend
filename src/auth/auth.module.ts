import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleOAuthStrategy } from './oauth.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_AUTH_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_AUTH_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtAuthStrategy, GoogleOAuthStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
