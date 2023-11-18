import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest, CreateUserResponse } from './user.dto';
import { EmptyResponse } from '../common/common_request.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @ApiOperation({ summary: 'Create user', deprecated: false })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(createUserRequest);
    return {
      message: 'User created successfully',
      data: {
        userId: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ type: EmptyResponse })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<EmptyResponse> {
    const isSuccess = await this.userService.deleteUser(userId);
    return {
      message: isSuccess ? 'User deleted successfully' : 'User not deleted',
    };
  }
}
