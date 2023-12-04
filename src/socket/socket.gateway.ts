import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
} from './socket.dto';

import * as moment from 'moment';
import { ChatMessageService } from '../chat-message/chat-message.service';
import { SocketService } from './socket.service';
import { SocketEventEnum } from './socket-event.enum';

@WebSocketGateway({ namespace: 'chat' })
export class ChatSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  afterInit(server: Server): void {
    this.socketService.setSocketServer(server);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const isUserValid = await this.socketService.authenticateClient(client);
    if (!isUserValid) {
      Logger.error(`client ${client.id} is not valid`);
      client.disconnect();
      return;
    }

    Logger.log(`client ${client.id} connect to web socket.`);
    this.socketService.publishEvent(
      client.id,
      SocketEventEnum.info,
      'welcome to chat server',
    );
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.socketService.removeClientSocket(client.id);
    Logger.log(`client ${client.id} disconnect from web socket.`);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() joinRequest: JoinRoomSocketRequest,
    @ConnectedSocket() client: Socket,
  ) {
    if (!joinRequest.chatRoomId) {
      return this.socketService.throwErrorToSocket(
        client.id,
        'chatRoomId is required',
      );
    }

    if (this.socketService.isClientInRoom(client.id, joinRequest.chatRoomId)) {
      Logger.error(
        `client ${client.id} is already in room ${joinRequest.chatRoomId}`,
      );
      return this.socketService.throwErrorToSocket(
        client.id,
        `you are already in room ${joinRequest.chatRoomId}`,
      );
    }

    this.socketService.joinRoom(client.id, joinRequest.chatRoomId);
    this.socketService.publishEvent(
      client.id,
      SocketEventEnum.info,
      `join room ${joinRequest.chatRoomId}`,
    );

    const clientsInRoom = this.socketService.getClientsInRoom(
      joinRequest.chatRoomId,
    );

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

    if (!this.socketService.isRoomExist(chatRoomId)) {
      return this.socketService.throwErrorToSocket(
        client.id,
        `room ${chatRoomId} does not exist`,
      );
    }

    if (!this.socketService.isClientInRoom(client.id, chatRoomId)) {
      return this.socketService.throwErrorToSocket(
        client.id,
        `you are not in room ${chatRoomId}`,
      );
    }

    const fullMessage: ChatMessageSocketResponse = {
      ...message,
      createdAt: moment().utc().toDate(),
    };

    this.socketService.publishEventToRoom(
      chatRoomId,
      SocketEventEnum.message,
      fullMessage,
    );
    await this.chatMessageService.createChatMessage(fullMessage);
  }
}
