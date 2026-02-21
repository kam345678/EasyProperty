import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('tenant')
  @Post(':type')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const allowedTypes = ['avatars', 'slips', 'maintenance'];

    if (!allowedTypes.includes(type)) {
      throw new BadRequestException('Invalid upload type');
    }

    const result: any = await this.uploadService.uploadImage(file, type);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
