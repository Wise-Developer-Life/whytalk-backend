import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../common/common_request.dto';

export abstract class CreateUserRequest {
  @ApiProperty({
    description: 'User email',
    example: 'taya1234@@gmail.com',
    required: true,
  })
  readonly email: string;
}

export class UserResponse {
  readonly userId: string;
  readonly email: string;
  readonly createdAt: Date;
}

export class CreateUserResponse extends CommonResponse {
  readonly data: UserResponse;
}
