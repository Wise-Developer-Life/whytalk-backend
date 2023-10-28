import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}
  async getChatMessages(chatRoomId: string, messageId: number, limit: number) {
    return this.chatMessageRepository.find({
      where: {
        id: LessThanOrEqual(messageId),
        chatRoom: { id: chatRoomId },
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });
  }
}
