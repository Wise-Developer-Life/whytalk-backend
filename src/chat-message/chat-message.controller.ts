import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageResponse, CreateMessageRequest } from './chat.dto';
import { CommonResponse, EmptyResponse } from '../common/common.dto';

@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}
  @Get(':chatRoomId')
  async getChatMessages(
    @Param('chatRoomId') chatRoomId: string,
    @Query('messageId') messageId: number,
    @Query('limit') limit: number,
  ) {
    return await this.chatMessageService.getChatMessages(
      chatRoomId,
      messageId,
      limit,
    );
  }

  @Post(':chatRoomId')
  async createMessage(
    @Param('chatRoomId') chatRoomId: string,
    @Body() createMessageRequest: CreateMessageRequest,
  ): Promise<CommonResponse<ChatMessageResponse>> {
    const message = await this.chatMessageService.createChatMessage({
      ...createMessageRequest,
      chatRoomId,
    });

    return {
      message: 'success',
      data: {
        content: message.content,
        id: message.id,
        fromUserId: message.fromUserId,
        toUserId: message.toUserId,
        chatRoomId: message.chatRoom.id,
        createdAt: message.createdAt,
      },
    };
  }

  @Put(':messageId')
  async updateMessage(
    @Param('messageId') messageId: number,
    @Body('content') content: string,
  ): Promise<CommonResponse<ChatMessageResponse>> {
    const updatedMessage = await this.chatMessageService.updateMessage(
      messageId,
      content,
    );

    return {
      message: updatedMessage ? 'success' : 'fail',
      data: {
        content: updatedMessage.content,
        id: updatedMessage.id,
        fromUserId: updatedMessage.fromUserId,
        toUserId: updatedMessage.toUserId,
        chatRoomId: updatedMessage.chatRoom.id,
        createdAt: updatedMessage.createdAt,
      },
    };
  }

  @Delete(':messageId')
  async deleteMessage(
    @Param('messageId') messageId: number,
  ): Promise<EmptyResponse> {
    const isSuccess = await this.chatMessageService.deleteMessage(messageId);
    return {
      message: isSuccess ? 'success' : 'fail',
    };
  }
}
