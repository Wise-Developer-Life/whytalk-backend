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
import { CreateMessageRequest } from './chat.dto';
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

  @Post()
  async createMessage(
    @Body() createMessageRequest: CreateMessageRequest,
  ): Promise<CommonResponse<any>> {
    const message = await this.chatMessageService.createChatMessage({
      ...createMessageRequest,
    });

    return {
      message: 'success',
      data: message,
    };
  }

  @Put(':messageId')
  async updateMessage(
    @Param('messageId') messageId: number,
    @Body('content') content: string,
  ): Promise<CommonResponse<any>> {
    const newMessage = await this.chatMessageService.updateMessage(
      messageId,
      content,
    );
    return {
      message: newMessage ? 'success' : 'fail',
      data: newMessage,
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
