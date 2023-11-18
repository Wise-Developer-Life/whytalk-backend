import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import {
  CreateMessageRequest,
  CreateMessageResponse,
  ScrolledChatMessagesResponse,
  UpdateMessageResponse,
} from './chat-message.dto';
import { EmptyResponse } from '../common/common_request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat Service')
@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}
  @Get(':chatRoomId')
  async getChatMessages(
    @Param('chatRoomId') chatRoomId: string,
    @Query('messageId') messageId: number,
    @Query('limit') limit: number,
  ): Promise<ScrolledChatMessagesResponse> {
    const messages = await this.chatMessageService.getChatMessages(
      chatRoomId,
      messageId,
      limit,
    );

    const messageResp = messages.map((message) => ({
      id: message.id,
      content: message.content,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      chatRoomId: message.chatRoom.id,
      createdAt: message.createdAt,
    }));

    return {
      limit,
      anchor: messageId,
      items: messageResp,
    };
  }

  @ApiOperation({ summary: 'Create message', deprecated: true })
  @Post(':chatRoomId')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(
    @Param('chatRoomId') chatRoomId: string,
    @Body() createMessageRequest: CreateMessageRequest,
  ): Promise<CreateMessageResponse> {
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

  @ApiOperation({ summary: 'Update message' })
  @Patch(':messageId')
  async updateMessage(
    @Param('messageId') messageId: number,
    @Body('content') content: string,
  ): Promise<UpdateMessageResponse> {
    const updatedMessage = await this.chatMessageService.updateMessage(
      messageId,
      content,
    );

    return {
      message: updatedMessage ? 'success' : 'fail',
      data: {
        content: updatedMessage.content,
        id: updatedMessage.id,
        // fromUserId: updatedMessage.fromUserId,
        // toUserId: updatedMessage.toUserId,
        // chatRoomId: updatedMessage.chatRoom.id,
        // createdAt: updatedMessage.createdAt,
      },
    };
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'Delete message by id' })
  async deleteMessage(
    @Param('messageId') messageId: number,
  ): Promise<EmptyResponse> {
    const isSuccess = await this.chatMessageService.deleteMessage(messageId);
    return {
      message: isSuccess ? 'success' : 'fail',
    };
  }
}
