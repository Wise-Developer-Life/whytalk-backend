import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { CreateUserRequest } from '../user/user.dto';

@Injectable()
export class ScriptService {
  constructor(
    private readonly authService: AuthService,

    private readonly userService: UserService,
  ) {}
  public async runScript() {
    await this.createTestUsers();
  }

  private async createTestUsers() {
    const users: CreateUserRequest[] = [
      {
        email: 'taya87137@gmail.com',
      },
      {
        email: 'taya87138@gmail.com',
      },
      {
        email: 'taya87139@gmail.com',
      },
    ];

    const clearUsersPromise = Promise.all(
      users.map((user) => this.userService.deleteUserByEmail(user.email)),
    );

    await clearUsersPromise;
    Logger.log(`[Testing] clear users`);

    const createUsersPromise = Promise.all(
      users.map((user) => this.userService.createUser(user)),
    );

    const testUsers = await createUsersPromise;

    for (const testUser of testUsers) {
      const token = await this.authService.generateJwtToken({
        userId: testUser.id,
        email: testUser.email,
      });
      Logger.log(
        `[Testing] user: ${JSON.stringify({
          ...testUser,
          token,
        })}`,
      );
    }
  }
}
