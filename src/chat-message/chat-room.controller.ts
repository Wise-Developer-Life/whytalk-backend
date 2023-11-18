import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatRoomService } from './chat_room.service';
import { EmptyResponse } from '../common/common_request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ChatRoomResponse,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  ScrolledChatRoomsResponse,
} from './chat-room.dto';

@ApiTags('Chat Service')
@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiOperation({ summary: 'Get chat rooms by user id' })
  @Get(':userId')
  async getChatRooms(
    @Param('userId') userId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<ScrolledChatRoomsResponse> {
    const chatRooms = await this.chatRoomService.getChatRoomsByUserId(
      userId,
      offset,
      limit,
    );

    const rooms = chatRooms.map(
      (chatRoom): ChatRoomResponse => ({
        id: chatRoom.id,
        user1Id: chatRoom.user1Id,
        user2Id: chatRoom.user2Id,
        lastMessage: {
          id: chatRoom.lastMessage.id,
          content: chatRoom.lastMessage.content,
          fromUserId: chatRoom.lastMessage.fromUserId,
          toUserId: chatRoom.lastMessage.toUserId,
          chatRoomId: chatRoom.lastMessage.chatRoom.id,
          createdAt: chatRoom.lastMessage.createdAt,
        },
        updatedAt: chatRoom.updatedAt,
      }),
    );

    return {
      items: rooms,
      limit,
      //FIXME: fix anchor
      anchor: offset,
    };
  }

  @ApiOperation({ summary: 'Create chat room' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createChatRoom(
    @Body() createChatRoomRequest: CreateChatRoomRequest,
  ): Promise<CreateChatRoomResponse> {
    const chatRoom = await this.chatRoomService.createChatRoom(
      createChatRoomRequest.user1Id,
      createChatRoomRequest.user2Id,
    );

    return {
      message: 'success',
      data: {
        id: chatRoom.id,
        user1Id: chatRoom.user1Id,
        user2Id: chatRoom.user2Id,
        updatedAt: chatRoom.updatedAt,
        lastMessage: {
          id: chatRoom.lastMessage.id,
          content: chatRoom.lastMessage.content,
          fromUserId: chatRoom.lastMessage.fromUserId,
          toUserId: chatRoom.lastMessage.toUserId,
          chatRoomId: chatRoom.lastMessage.chatRoom.id,
          createdAt: chatRoom.lastMessage.createdAt,
        },
      },
    };
  }

  @ApiOperation({ summary: 'Delete chat room' })
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
