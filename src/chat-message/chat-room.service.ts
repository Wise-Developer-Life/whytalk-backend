import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './chat-room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async createChatRoom(user1: string, user2: string) {
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

  async getChatRoomByUserId(userId: string, offset: number, limit: number) {
    return this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      order: {
        updatedAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });
  }

  async deleteChatRoom(chatRoomId: string) {
    const result = await this.chatRoomRepository.delete(chatRoomId);
    return result.affected === 1;
  }
}
