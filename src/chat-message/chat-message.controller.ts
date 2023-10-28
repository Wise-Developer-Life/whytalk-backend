import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';

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
}
