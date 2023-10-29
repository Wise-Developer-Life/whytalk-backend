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

@WebSocketGateway()
export class ChatSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connectedUsers = new Map<string, string[]>();

  constructor() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    Logger.log(`client ${client.id} connect to web socket.`);
    this.connectedUsers.set(client.id, []);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    Logger.log(`client ${client.id} disconnect from web socket.`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() joinRequest: JoinRoomSocketRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const rooms = this.connectedUsers.get(client.id) ?? [];
    rooms.push(joinRequest.chatRoomId);
    client.join(joinRequest.chatRoomId);

    const clientsInRoom = this.server.sockets.adapter.rooms.get(
      joinRequest.chatRoomId,
    );

    Logger.log(
      `client ${client.id} join room ${
        joinRequest.chatRoomId
      } with clients ${Array.from(clientsInRoom)}.`,
    );
  }

  @SubscribeMessage('chat-message')
  async receiveMessage(@MessageBody() message: ChatMessageSocketRequest) {
    const { chatRoomId } = message;

    const fullMessage: ChatMessageSocketResponse = {
      ...message,
      createdAt: Date.now(),
    };

    console.log(`receive message in room ${chatRoomId}...`, fullMessage);
    this.server.to(chatRoomId).emit(`message`, fullMessage);
  }
}
