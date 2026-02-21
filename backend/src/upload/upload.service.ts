import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    const uniqueFileName = uuidv4();
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `EasyApartment/${folder}`,
            public_id: uniqueFileName,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    return cloudinary.uploader.destroy(publicId);
  }
}
