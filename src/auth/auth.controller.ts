import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Profile } from 'passport-google-oauth20';

interface RequestWithOAuthUser extends Request {
  user: Profile;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() request: RequestWithOAuthUser) {
    return request.user;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOAuthCallback(@Req() request: RequestWithOAuthUser) {
    const userProfile = request.user;
    const userPayload = {
      email: userProfile.emails[0].value,
      name: userProfile.displayName,
    };

    // update user info and save to db
    const isUserExist = await this.userService.isUserExistByEmail(
      userPayload.email,
    );
    if (!isUserExist) {
      await this.userService.createUser(userPayload);
    }

    // const currentUser = await this.userService.getUserByEmail(
    //   userPayload.email,
    // );

    // generate token
    const accessToken = await this.jwtService.signAsync(
      {
        email: userPayload.email,
      },
      {
        secret: this.configService.get<string>('JWT_AUTH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_AUTH_EXPIRATION_TIME'),
      },
    );

    return {
      accessToken,
    };
  }
}
