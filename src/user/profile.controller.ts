import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { CommonResponse } from '../common/common.dto';
import {
  CreateBasicInfoRequest,
  ProfileImageResponse,
  ProfileResponse,
  UpdateProfileRequest,
} from './profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // design query: load_image=boolean
  @Get(':userId')
  async getProfile(
    @Param('userId') userId: string,
  ): Promise<CommonResponse<ProfileResponse>> {
    const profile = await this.profileService.getProfile(userId);
    return {
      message: 'Profile retrieved successfully',
      data: {
        userId: userId,
        name: profile.name,
        bio: profile.bio,
      },
    };
  }

  @Post(':userId')
  async createBasicInfo(
    @Param('userId') userId: string,
    @Body() createBasicInfoRequest: CreateBasicInfoRequest,
  ): Promise<CommonResponse<ProfileResponse>> {
    const profile = await this.profileService.createBasicInfo(
      userId,
      createBasicInfoRequest,
    );
    return {
      message: 'Basic info created successfully',
      data: {
        userId: userId,
        name: profile.name,
        bio: profile.bio,
      },
    };
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateRequest: UpdateProfileRequest,
  ): Promise<CommonResponse<ProfileResponse>> {
    const updatedProfile = await this.profileService.updateProfile(
      userId,
      updateRequest,
    );
    return {
      message: 'Profile updated successfully',
      data: {
        userId,
        name: updatedProfile.name,
        bio: updatedProfile.bio,
      },
    };
  }

  @Post(':userId/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpeg|png|jpg)/,
          }),
        ],
        exceptionFactory: (errors) => {
          throw new Error(`Fuck you error ${errors}`);
        },
      }),
    )
    image: Express.Multer.File,
  ): Promise<CommonResponse<ProfileImageResponse>> {
    const imageEntity = await this.profileService.uploadProfileImage(
      userId,
      image,
    );

    return {
      message: 'Image uploaded successfully',
      data: {
        id: imageEntity.id,
        order: imageEntity.order,
        createdAt: imageEntity.createdAt,
        user: userId,
      },
    };
  }
}
