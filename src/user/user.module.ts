import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileImage } from './profile_image.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { LocalImageStorageManager } from './local-image-storage-manager';
import { UserProfile } from './profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, ProfileImage])],
  controllers: [UserController, ProfileController],
  providers: [
    UserService,
    ProfileService,
    { provide: 'ImageStorageManager', useClass: LocalImageStorageManager },
  ],
  exports: [UserService],
})
export class UserModule {}
