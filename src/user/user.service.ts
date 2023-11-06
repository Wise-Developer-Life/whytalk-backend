import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUser(userId: string) {
    return this.userRepository.findOneBy({ id: userId });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  async updateUser(userId: string, updateRequest: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    for (const key in updateRequest) {
      user[key] = updateRequest[key] || user[key];
    }

    return this.userRepository.save(user);
  }

  async isUserExistByEmail(email: string) {
    return this.userRepository.exist({
      where: {
        email,
      },
    });
  }
}
