import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

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

  @Put(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateRequest: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateRequest);
  }
}
