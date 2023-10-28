import { Gender } from './user.type';

export interface CreateUserDto {
  name: string;
  email: string;
  gender: Gender;
  birthDate: Date;
}

export interface UpdateUserDto {
  name?: string;
}
