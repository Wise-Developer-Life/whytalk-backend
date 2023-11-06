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
  chatRoomId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
}
