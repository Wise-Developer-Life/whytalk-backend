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
  ProfileImageResponse,
  ProfileResponse,
  UpdateProfileRequest,
} from './profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //FIXME: @Get(':userId') is not implemented
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return { userId };
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateRequest: UpdateProfileRequest,
  ): Promise<CommonResponse<ProfileResponse>> {
    const updatedUser = await this.profileService.updateProfile(
      userId,
      updateRequest,
    );
    const profileImages = await updatedUser.getProfileImages(true);
    const imageResponse = profileImages.map((image) => ({
      id: image.id,
      order: image.order,
      createdAt: image.createdAt,
      user: image.user.id,
    }));
    return {
      message: 'Profile updated successfully',
      data: {
        userId: updatedUser.id,
        name: updatedUser.name,
        bio: updatedUser.bio,
        profileImages: imageResponse,
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
        user: imageEntity.user.id,
      },
    };
  }
}
