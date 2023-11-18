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

  async createUser(user: CreateUserRequest) {
    return this.userRepository.save({ ...user });
  }

  async deleteUser(userId: string) {
    const user = await this.getUser(userId);
    const userProfile = await user.profile;
    await this.userRepository.update(userId, {
      profile: null,
    });

    const removedProfile = await this.userProfileRepository.remove(userProfile);
    const removedUser = await this.userRepository.remove(user);
    return !!removedUser && !!removedProfile;
  }

  async isUserExistByEmail(email: string) {
    return this.userRepository.exist({
      where: {
        email,
      },
    });
  }
}
