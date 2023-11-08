import { Module } from '@nestjs/common';
import { ChatMessageModule } from '../chat-message/chat-message.module';

@Module({
  imports: [ChatMessageModule],
})
export class ChatSocketModule {}
