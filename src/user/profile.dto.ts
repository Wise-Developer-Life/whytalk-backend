import { Gender } from './user.type';

export interface CreateBasicInfoRequest {
  name: string;
  gender: Gender;
  birthDate: Date;
}

export interface UpdateProfileRequest {
  name: string;
  bio: string;
}

export interface ProfileResponse {
  userId: string;
  name: string;
  bio: string;
  profileImages?: ProfileImageResponse[];
}

export interface ProfileImageResponse {
  id: string;
  order: number;
  user: string;
  createdAt: Date;
}
