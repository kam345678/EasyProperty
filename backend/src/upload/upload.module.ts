import { CloudinaryProvider } from '../config/cloudinary.config';
import { UsersModule } from 'src/users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService],
})
export class UploadModule {}
