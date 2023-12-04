import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AuthModule } from '../auth/auth.module';
import { ChatSocketGateway } from './socket.gateway';
import { ChatMessageModule } from '../chat-message/chat-message.module';

@Module({
  imports: [AuthModule, ChatMessageModule],
  providers: [SocketService, ChatSocketGateway],
  exports: [SocketService, ChatSocketGateway],
})
export class SocketModule {}
