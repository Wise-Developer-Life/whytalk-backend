export interface CreateMessageDTO {
  chatRoomId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
}

export interface CreateChatRoomRequest {
  user1Id: string;
  user2Id: string;
}

export interface CreateMessageRequest {
  fromUserId: string;
  toUserId: string;
  content: string;
}

export interface ChatMessageResponse {
  id: number;
  content: string;
  fromUserId: string;
  toUserId: string;
  chatRoomId: string;
  createdAt: Date;
}
