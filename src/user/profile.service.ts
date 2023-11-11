import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ImageStorageManager } from './profile.interface';
import { ProfileImage } from './profile_image.entity';
import { UpdateProfileRequest } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProfileImage)
    private profileImageRepository: Repository<ProfileImage>,
    @Inject('ImageStorageManager')
    private readonly imageManager: ImageStorageManager,
  ) {}

  async updateProfile(userId: string, updateRequest: UpdateProfileRequest) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    user.name = updateRequest.name || user.name;
    user.bio = updateRequest.bio || user.bio;

    return this.userRepository.save(user);
  }

  async uploadProfileImage(userId: string, image: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    if (!image) {
      throw new Error('Image not found');
    }

    const profileImages = await user.getProfileImages();
    const imageEntity = this.profileImageRepository.create({
      order: profileImages.length,
      user,
    });
    console.log(
      `[uploadProfileImage] imageEntity: ${JSON.stringify(imageEntity)}`,
    );
    const newImageEntity = await this.profileImageRepository.save(imageEntity);
    // TODO: upload image to s3 sdk instead of local (challenge: save image asynchronously)
    const imageData = image.buffer;
    const extension = image.originalname.split('.')[1];

    // TODO: compress image all to jpg?
    const imageFileName = `${user.id}_${newImageEntity.id}.${extension}`;
    Logger.log(`[uploadProfileImage] imageFileName: ${imageFileName}`);
    const imageUrl = await this.imageManager.uploadImage(
      imageData,
      imageFileName,
    );

    return this.profileImageRepository.save({
      ...newImageEntity,
      url: imageUrl,
    });
  }
}
