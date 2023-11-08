export interface ChatMessageSocketRequest {
  chatRoomId: string;
  content: string;
  fromUserId: string;
  toUserId: string;
}

export interface ChatMessageSocketResponse extends ChatMessageSocketRequest {
  createdAt: Date;
}

export interface JoinRoomSocketRequest {
  chatRoomId: string;
}
