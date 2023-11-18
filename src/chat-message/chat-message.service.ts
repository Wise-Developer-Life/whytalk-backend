import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDTO } from './chat-message.dto';
import { ChatRoomService } from './chat_room.service';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private chatRoomService: ChatRoomService,
  ) {}

  async createChatMessage(chatMessage: CreateMessageDTO) {
    const { chatRoomId } = chatMessage;
    const messageEntity = this.chatMessageRepository.create({
      content: chatMessage.content,
      fromUserId: chatMessage.fromUserId,
      toUserId: chatMessage.toUserId,
      chatRoom: { id: chatRoomId },
    });

    const newMessage = await this.chatMessageRepository.save(messageEntity);
    await this.chatRoomService.updateChatRoom(chatRoomId, newMessage);

    return newMessage;
  }
  async getChatMessage(messageId: number) {
    return this.chatMessageRepository.findOne({
      where: { id: messageId },
      relations: ['chatRoom'],
    });
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
    const updatedResult = await this.chatMessageRepository.update(messageId, {
      content,
    });

    if (updatedResult.affected !== 1) {
      return null;
    }

    return this.getChatMessage(messageId);
  }

  async deleteMessage(messageId: number) {
    const result = await this.chatMessageRepository.delete(messageId);
    return result.affected === 1;
  }
}
