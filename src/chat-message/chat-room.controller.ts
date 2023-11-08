import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomRequest } from './chat.dto';
import { CommonResponse, EmptyResponse } from '../common/common.dto';
import { ChatRoom } from './chat-room.entity';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get(':userId')
  async getChatRooms(
    @Param('userId') userId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<CommonResponse<ChatRoom[]>> {
    const chatRooms = await this.chatRoomService.getChatRoomsByUserId(
      userId,
      offset,
      limit,
    );

    return {
      message: 'success',
      data: chatRooms,
    };
  }

  @Post()
  async createChatRoom(
    @Body() createChatRoomRequest: CreateChatRoomRequest,
  ): Promise<CommonResponse<ChatRoom>> {
    const chatRoom = await this.chatRoomService.createChatRoom(
      createChatRoomRequest.user1Id,
      createChatRoomRequest.user2Id,
    );

    return {
      message: 'success',
      data: chatRoom,
    };
  }

  @Delete(':chatRoomId')
  async deleteChatRoom(
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<EmptyResponse> {
    const isSuccess = await this.chatRoomService.deleteChatRoom(chatRoomId);
    return {
      message: isSuccess ? 'success' : 'fail',
    };
  }
}
