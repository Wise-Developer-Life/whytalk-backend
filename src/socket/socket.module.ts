import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
