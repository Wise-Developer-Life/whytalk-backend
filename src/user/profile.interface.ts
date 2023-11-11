export interface ImageStorageManager {
  uploadImage(image: Buffer, imageFileName: string): Promise<string>;
  deleteImage(imageUrl: string): Promise<void>;
}
