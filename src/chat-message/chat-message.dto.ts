import {
  CommonResponse,
  ScrollPaginatedResponse,
} from '../common/common_request.dto';

export class CreateMessageDTO {
  chatRoomId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
}

export class CreateMessageRequest {
  readonly fromUserId: string;
  readonly toUserId: string;
  readonly content: string;
}

export class ChatMessageResponse {
  readonly id: number;
  readonly content: string;
  readonly fromUserId: string;
  readonly toUserId: string;
  readonly chatRoomId: string;
  readonly createdAt: Date;
}

export class CreateMessageResponse extends CommonResponse {
  readonly data: ChatMessageResponse;
}

export class UpdateMessageResponse extends CommonResponse {
  readonly data: {
    id: number;
    content: string;
  };
}

export class ScrolledChatMessagesResponse extends ScrollPaginatedResponse {
  readonly items: ChatMessageResponse[];
}
