import { ChatMessageResponse } from './chat-message.dto';
import {
  CommonResponse,
  ScrollPaginatedResponse,
} from '../common/common_request.dto';

export class CreateChatRoomRequest {
  readonly user1Id: string;
  readonly user2Id: string;
}

export class ChatRoomResponse {
  readonly id: string;
  readonly user1Id: string;
  readonly user2Id: string;
  readonly lastMessage: ChatMessageResponse;
  readonly updatedAt: Date;
}

export class CreateChatRoomResponse extends CommonResponse {
  readonly data: ChatRoomResponse;
}

export class ScrolledChatRoomsResponse extends ScrollPaginatedResponse {
  readonly items: ChatRoomResponse[];
}
