import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { SocketEventEnum } from './socket-event.enum';

@Injectable()
export class SocketService {
  private socketServer: Server = null;
  private readonly mapClientSockets = new Map<string, Socket>();
  private readonly mapUserSockets = new Map<string, string>();
  private readonly mapSocketUsers = new Map<string, string>();

  constructor(private readonly authService: AuthService) {}

  async authenticateClient(socket: Socket) {
    const { authorization } = socket.handshake.headers;
    const token = this.authService.extractTokenFromAuthHeader(authorization);
    const payload = await this.authService.validateJwtToken(token);

    if (!payload) {
      return false;
    }

    const { userId } = payload;

    this.mapClientSockets.set(socket.id, socket);
    this.mapSocketUsers.set(socket.id, userId);
    this.mapUserSockets.set(userId, socket.id);

    return true;
  }
  setSocketServer(socketServer: Server) {
    this.socketServer = socketServer;
  }

  removeClientSocket(clientId: string) {
    const userId = this.mapSocketUsers.get(clientId);
    this.mapClientSockets.delete(clientId);
    this.mapSocketUsers.delete(clientId);
    this.mapUserSockets.delete(userId);
  }

  joinRoom(clientId: string, roomId: string) {
    const clientSocket = this.mapClientSockets.get(clientId);
    if (!clientSocket) {
      throw new Error(`client ${clientId} is not connected`);
    }

    clientSocket.join(roomId);
  }

  leaveRoom(clientId: string, roomId: string) {
    const clientSocket = this.mapClientSockets.get(clientId);
    if (!clientSocket) {
      throw new Error(`client ${clientId} is not connected`);
    }
    clientSocket.leave(roomId);
  }

  isRoomExist(roomId: string) {
    return this.socketServer.sockets.adapter.rooms.has(roomId);
  }

  getClientsInRoom(roomId: string) {
    return this.socketServer.sockets.adapter.rooms.get(roomId);
  }

  isClientInRoom(clientId: string, roomId: string) {
    const clients = this.getClientsInRoom(roomId);
    return clients && clients.has(clientId);
  }

  publishEventToRoom<T>(roomId: string, event: SocketEventEnum, payload: T) {
    if (!this.socketServer) {
      throw new Error('socket server is not set');
    }
    this.socketServer.to(roomId).emit(event, payload);
  }

  broadcastEvent<T>(event: SocketEventEnum, payload: T) {
    if (!this.socketServer) {
      throw new Error('socket server is not set');
    }
    this.socketServer.emit(event, payload);
  }

  publishEvent<T>(client: string, event: SocketEventEnum, payload: T) {
    const socket = this.mapClientSockets.get(client);
    if (!socket) {
      throw new Error(`client ${client} is not connected`);
    }
    socket.emit(event, payload);
  }

  publishEventToUser<T>(userId: string, event: SocketEventEnum, payload: T) {
    const client = this.mapUserSockets.get(userId);
    if (!client) {
      throw new Error(`user ${userId} is not connected`);
    }
    this.publishEvent(client, event, payload);
  }

  throwErrorToSocket<T>(client: string, payload: T) {
    this.publishEvent(client, SocketEventEnum.error, payload);
  }
}
