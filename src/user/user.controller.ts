import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { CommonResponse } from '../common/common.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @Post()
  createUser(@Body() createUserRequest: CreateUserDto) {
    return this.userService.createUser(createUserRequest);
  }

  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<CommonResponse<void>> {
    const isSuccess = await this.userService.deleteUser(userId);
    return {
      message: isSuccess ? 'User deleted successfully' : 'User not deleted',
    };
  }
}
