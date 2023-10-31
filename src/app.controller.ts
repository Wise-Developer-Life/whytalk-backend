import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: any;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/private')
  @UseGuards(AuthGuard('jwt'))
  async getVIPHello(@Req() request: RequestWithUser) {
    const email = request.user.email;
    return `Hello ${email} VIP`;
  }
}
