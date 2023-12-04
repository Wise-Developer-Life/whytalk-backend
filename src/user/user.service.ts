import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async getUser(userId: string) {
    return this.userRepository.findOneBy({ id: userId });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(user: CreateUserRequest) {
    return this.userRepository.save({ ...user });
  }

  async deleteUser(userId: string) {
    const user = await this.getUser(userId);
    if (!user) {
      return false;
    }

    const userProfile = await user.profile;
    if (userProfile) {
      await this.userRepository.update(userId, {
        profile: null,
      });
      await this.userProfileRepository.remove(userProfile);
    }
    await this.userRepository.remove(user);
    return true;
  }

  async deleteUserByEmail(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return false;
    }
    return this.deleteUser(user.id);
  }

  async isUserExistByEmail(email: string) {
    return this.userRepository.exist({
      where: {
        email,
      },
    });
  }
}
