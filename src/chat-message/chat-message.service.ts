import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDTO } from './chat.dto';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createChatMessage(chatMessage: CreateMessageDTO) {
    const messageEntity = this.chatMessageRepository.create({
      content: chatMessage.content,
      fromUserId: chatMessage.fromUserId,
      toUserId: chatMessage.toUserId,
      chatRoom: {
        id: chatMessage.chatRoomId,
        updatedAt: Date.now(),
      },
    });
    return this.chatMessageRepository.save(messageEntity);
  }

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

  async updateMessage(messageId: number, content: string) {
    const oldMessage = await this.chatMessageRepository.findOneBy({
      id: messageId,
    });

    if (!oldMessage || !content) {
      return undefined;
    }

    oldMessage.content = content;
    return this.chatMessageRepository.save(oldMessage);
  }

  async deleteMessage(messageId: number) {
    const result = await this.chatMessageRepository.delete(messageId);
    return result.affected === 1;
  }
}
