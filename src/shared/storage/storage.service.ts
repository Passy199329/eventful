import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {

  async uploadFile(
    file: Express.Multer.File,
  ) {

    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      path: file.path,
    };
  }

  async deleteFile(
    filename: string,
  ) {

    return {
      success: true,
      filename,
    };
  }
}