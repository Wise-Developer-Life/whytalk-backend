// TODO: enable filter functionality in the future
import { CommonResponse } from '../common/common_request.dto';
import { Gender } from '../user/user.type';

export class FilterBody {
  gender: Gender[];
  ageRange: {
    min: number;
    max: number;
  };
}

export class MatchingJobMQMessage {
  userId: string;
  createdAt: Date;
}
export class StartMatchResponse extends CommonResponse {
  matchId: string;
  userId: string;
}
