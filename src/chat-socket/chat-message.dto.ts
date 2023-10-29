export interface ChatMessageSocketRequest {
  chatRoomId: string;
  content: string;
  fromUserId: string;
  toUserId: string;
}

export interface ChatMessageSocketResponse extends ChatMessageSocketRequest {
  createdAt: number;
}

export interface JoinRoomSocketRequest {
  chatRoomId: string;
}
