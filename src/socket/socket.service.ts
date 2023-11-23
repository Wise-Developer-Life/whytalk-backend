import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

type socketEvent = 'message' | 'info' | 'error' | 'warning';

@Injectable()
export class SocketService {
  private socketServer: Server = null;
  private readonly mapClientSockets = new Map<string, Socket>();

  constructor() {}

  setSocketServer(socketServer: Server) {
    this.socketServer = socketServer;
  }

  setClientSocket(clientId: string, socket: Socket) {
    this.mapClientSockets.set(clientId, socket);
  }

  removeClientSocket(clientId: string) {
    this.mapClientSockets.delete(clientId);
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

  publishEventToRoom<T>(roomId: string, event: socketEvent, payload: T) {
    if (!this.socketServer) {
      throw new Error('socket server is not set');
    }
    this.socketServer.to(roomId).emit(event, payload);
  }

  broadcastEvent<T>(event: socketEvent, payload: T) {
    if (!this.socketServer) {
      throw new Error('socket server is not set');
    }
    this.socketServer.emit(event, payload);
  }

  publishEvent<T>(client: string, event: socketEvent, payload: T) {
    const socket = this.mapClientSockets.get(client);
    if (!socket) {
      throw new Error(`client ${client} is not connected`);
    }
    socket.emit(event, payload);
  }
}
