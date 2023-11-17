import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageStorageManager } from './profile.interface';
import { ProfileImage } from './profile_image.entity';
import { CreateBasicInfoRequest, UpdateProfileRequest } from './profile.dto';
import { UserProfile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(ProfileImage)
    private profileImageRepository: Repository<ProfileImage>,
    @Inject('ImageStorageManager')
    private readonly imageManager: ImageStorageManager,
  ) {}

  async getProfile(userId: string) {
    return this.userProfileRepository.findOneBy({ user: { id: userId } });
  }

  async createBasicInfo(userId: string, createRequest: CreateBasicInfoRequest) {
    if (await this.isProfileInitiated(userId)) {
      throw new Error(`User ${userId} has already initiated profile`);
    }

    return this.userProfileRepository.save({
      ...createRequest,
      user: {
        id: userId,
      },
    });
  }

  async updateProfile(userId: string, updateRequest: UpdateProfileRequest) {
    const profile = await this.getProfile(userId);

    if (!profile) {
      throw new Error(`User ${userId} not found or has no profile`);
    }

    profile.name = updateRequest.name || profile.name;
    profile.bio = updateRequest.bio || profile.bio;

    return this.userProfileRepository.save(profile);
  }

  async uploadProfileImage(userId: string, image: Express.Multer.File) {
    const profile = await this.getProfile(userId);

    if (!image) {
      throw new Error('Image not found');
    }

    const profileImages = await profile.getProfileImages();
    const imageEntity = this.profileImageRepository.create({
      order: profileImages.length,
      userProfile: profile,
    });
    console.log(
      `[uploadProfileImage] imageEntity: ${JSON.stringify(imageEntity)}`,
    );
    const newImageEntity = await this.profileImageRepository.save(imageEntity);
    // TODO: upload image to s3 sdk instead of local (challenge: save image asynchronously)
    const imageData = image.buffer;
    const extension = image.originalname.split('.')[1];

    // TODO: compress image all to jpg?
    const imageFileName = `${userId}_${newImageEntity.id}.${extension}`;
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

  private async isProfileInitiated(userId: string) {
    const profile = await this.getProfile(userId);
    return !!profile;
  }
}
