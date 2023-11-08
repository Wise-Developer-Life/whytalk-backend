import { Module } from '@nestjs/common';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageService } from './chat-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatRoom } from './chat-room.entity';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, ChatRoom])],
  controllers: [ChatMessageController, ChatRoomController],
  providers: [ChatMessageService, ChatRoomService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
