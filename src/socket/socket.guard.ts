import { CanActivate, Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io';

@Injectable()
export class SocketJwtAuthGuard implements CanActivate {
  constructor(private readonly socketService: SocketService) {}

  public async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client = context.switchToWs().getClient() as Socket;
    const isAuthPass = await this.socketService.authenticateClient(client);

    if (!isAuthPass) {
      this.socketService.throwErrorToSocket(client.id, 'auth failed');
    }

    return isAuthPass;
  }
}
