import { Injectable, Logger } from '@nestjs/common';
import { ImageStorageManager } from './profile.interface';
import * as Buffer from 'buffer';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalImageStorageManager implements ImageStorageManager {
  IMAGE_ROOT_FOLDER = path.join(__dirname, '..', '..', 'storage', 'images');
  constructor() {}

  private async createImageRootFolder(): Promise<void> {
    try {
      await fsPromises.access(this.IMAGE_ROOT_FOLDER);
    } catch (e) {
      await fsPromises.mkdir(this.IMAGE_ROOT_FOLDER, { recursive: true });
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    return fsPromises.unlink(imageUrl);
  }

  async uploadImage(image: Buffer, imageFileName: string): Promise<string> {
    await this.createImageRootFolder();
    const filePath = path.join(this.IMAGE_ROOT_FOLDER, imageFileName);
    Logger.log(`[uploadImage] save file path: ${filePath}`);
    await fsPromises.writeFile(filePath, image);
    return filePath;
  }
}
