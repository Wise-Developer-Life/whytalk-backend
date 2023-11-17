import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: any;
}
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(@Req() request: Request): string {
    return `Hello ${request.cookies}`;
  }

  @Get('/private')
  @UseGuards(AuthGuard('jwt'))
  async getVIPHello(@Req() request: RequestWithUser) {
    const email = request.user.email;
    return `Hello ${email} VIP`;
  }
}
