import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Profile } from 'passport-google-oauth20';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

interface RequestWithOAuthUser extends Request {
  user: Profile;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  @ApiOperation({ summary: 'Google OAuth2.0' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() request: RequestWithOAuthUser) {
    return request.user;
  }

  @ApiExcludeEndpoint()
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

    const currentUser = await this.userService.getUserByEmail(
      userPayload.email,
    );

    const accessToken = await this.authService.generateJwtToken({
      userId: currentUser.id,
      email: currentUser.email,
    });

    return {
      accessToken,
    };
  }
}
