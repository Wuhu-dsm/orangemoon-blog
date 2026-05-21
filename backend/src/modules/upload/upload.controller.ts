import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { memoryStorage } from 'multer';
import { Roles } from '../../common/decorators/roles.decorator';
import { DEFAULT_MAX_FILE_SIZE_BYTES } from '../../config/upload.config';
import { UploadPurposeDto } from './dto/upload-purpose.dto';
import { UploadService } from './upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Roles('admin')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpeg|png|webp|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: DEFAULT_MAX_FILE_SIZE_BYTES })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @Query() dto: UploadPurposeDto,
  ) {
    return this.uploadService.saveImage(file, dto.purpose);
  }
}
