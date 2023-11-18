import { Gender } from './user.type';
import { CommonResponse } from '../common/common_request.dto';

export class CreateBasicInfoRequest {
  name: string;
  gender: Gender;
  birthDate: Date;
}

export class UpdateProfileRequest {
  name: string;
  bio: string;
}

export class ProfileResponse {
  userId: string;
  name: string;
  bio: string;
  profileImages?: ProfileImageResponse[];
}

export class ProfileImageResponse {
  id: string;
  order: number;
  user: string;
  createdAt: Date;
}

export class RetrieveProfileResponse extends CommonResponse {
  readonly data: ProfileResponse;
}

export class CreateProfileResponse extends CommonResponse {
  readonly data: ProfileResponse;
}

export class UpdateProfileResponse extends CommonResponse {
  readonly data: ProfileResponse;
}

export class UploadProfileImageResponse extends CommonResponse {
  readonly data: ProfileImageResponse;
}
