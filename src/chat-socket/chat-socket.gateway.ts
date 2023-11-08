import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  ChatMessageSocketRequest,
  ChatMessageSocketResponse,
  JoinRoomSocketRequest,
} from './chat-message.dto';

import * as moment from 'moment';
import { ChatMessageService } from '../chat-message/chat-message.service';

@WebSocketGateway()
export class ChatSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly chatMessageService: ChatMessageService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    //FIXME: this can be removed
    this.broadcastEvent('info', `client ${client.id} connect to server.`);
    Logger.log(`client ${client.id} connect to web socket.`);
    this.sendMessage('info', `welcome to chat server`, client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //FIXME: this can be removed
    this.broadcastEvent('info', `client ${client.id} disconnect from server.`);
    Logger.log(`client ${client.id} disconnect from web socket.`);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() joinRequest: JoinRoomSocketRequest,
    @ConnectedSocket() client: Socket,
  ) {
    if (!joinRequest.chatRoomId) {
      this.sendMessage('error', `chatRoomId is required`, client);
      return;
    }

    if (this.isClientInRoom(client, joinRequest.chatRoomId)) {
      Logger.error(
        `client ${client.id} is already in room ${joinRequest.chatRoomId}`,
      );
      this.sendMessage(
        'error',
        `you are already in room ${joinRequest.chatRoomId}`,
        client,
      );
      return;
    }

    client.join(joinRequest.chatRoomId);
    this.sendMessage('info', `join room ${joinRequest.chatRoomId}`, client);

    const clientsInRoom = this.getClientsInRoom(joinRequest.chatRoomId);

    Logger.log(
      `client ${client.id} join room ${
        joinRequest.chatRoomId
      } with clients ${Array.from(clientsInRoom)}.`,
    );
  }

  @SubscribeMessage('message')
  async receiveMessage(
    @MessageBody() message: ChatMessageSocketRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = message;

    if (!this.isRoomExist(chatRoomId)) {
      return this.sendMessage(
        'error',
        `room ${chatRoomId} does not exist`,
        client,
      );
    }

    if (!this.isClientInRoom(client, chatRoomId)) {
      return this.sendMessage(
        'error',
        `you are not in room ${chatRoomId}`,
        client,
      );
    }

    const fullMessage: ChatMessageSocketResponse = {
      ...message,
      createdAt: moment().utc().toDate(),
    };

    this.publishEventToRoom(chatRoomId, 'message', fullMessage);
    await this.chatMessageService.createChatMessage(fullMessage);
  }

  private isRoomExist(roomId: string) {
    return this.server.sockets.adapter.rooms.has(roomId);
  }

  private getClientsInRoom(roomId: string) {
    return this.server.sockets.adapter.rooms.get(roomId);
  }

  private isClientInRoom(client: Socket, roomId: string) {
    const clientsInRoomId = this.getClientsInRoom(roomId);
    return clientsInRoomId?.has(client.id);
  }

  private broadcastEvent(event: string, data: object | string) {
    this.server.emit(event, data);
  }
  private publishEventToRoom(
    roomId: string,
    event: string,
    data: object | string,
  ) {
    if (!roomId) {
      this.server.emit(event, data);
      return;
    }

    this.server.to(roomId).emit(event, data);
  }

  private sendMessage(
    messageType: 'error' | 'info' | 'warning',
    message: string,
    client: Socket,
  ) {
    client.emit(messageType, {
      type: messageType,
      message: message,
    });
  }
}
