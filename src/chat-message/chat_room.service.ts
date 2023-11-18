import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './chat_room.entity';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async createChatRoom(user1: string, user2: string) {
    const existChatRoom = await this.getChatRoom(user1, user2);

    if (existChatRoom) {
      throw new HttpException(
        `Chat room for user ${user1} and user ${user2} already exist`,
        500,
      );
    }

    const chatRoom = this.chatRoomRepository.create({
      user1Id: user1,
      user2Id: user2,
    });
    return this.chatRoomRepository.save(chatRoom);
  }

  async getChatRoom(user1: string, user2: string) {
    return this.chatRoomRepository.findOne({
      where: [
        { user1Id: user1, user2Id: user2 },
        { user1Id: user2, user2Id: user1 },
      ],
    });
  }

  async getChatRoomById(chatRoomId: string) {
    return this.chatRoomRepository.findOneBy({ id: chatRoomId });
  }

  async getChatRoomsByUserId(userId: string, offset: number, limit: number) {
    return this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      order: {
        updatedAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });
  }

  async updateChatRoom(chatRoomId: string, lastMessage: ChatMessage) {
    const chatRoom = await this.getChatRoomById(chatRoomId);
    if (!chatRoom) {
      return;
    }

    chatRoom.lastMessage = lastMessage;
    return this.chatRoomRepository.save(chatRoom);
  }

  // FIXME
  async deleteChatRoom(chatRoomId: string) {
    const result = await this.chatRoomRepository.delete(chatRoomId);
    return result.affected === 1;
  }
}
