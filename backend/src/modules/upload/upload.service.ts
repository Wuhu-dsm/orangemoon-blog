import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { UploadPurpose } from './dto/upload-purpose.dto';

export type UploadResult = {
  url: string;
  filename: string;
  purpose: UploadPurpose;
  size: number;
  mimeType: string;
};

const IMAGE_MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;

  constructor(configService: ConfigService) {
    this.uploadDir = configService.getOrThrow<string>('upload.dir');
    this.maxFileSize = configService.getOrThrow<number>('upload.maxFileSize');
  }

  async saveImage(
    file: Express.Multer.File,
    purpose: UploadPurpose,
  ): Promise<UploadResult> {
    this.assertImage(file);

    const folder = join(this.uploadDir, purpose);
    await mkdir(folder, { recursive: true });

    const filename = this.createSafeFilename(file);
    await writeFile(join(folder, filename), file.buffer);

    return {
      url: `/uploads/${purpose}/${filename}`,
      filename,
      purpose,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  private assertImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Upload file is required');
    }

    if (file.size > this.maxFileSize) {
      throw new PayloadTooLargeException('Upload file is too large');
    }

    if (!IMAGE_MIME_EXTENSIONS[file.mimetype]) {
      throw new BadRequestException('Only image files are allowed');
    }
  }

  private createSafeFilename(file: Express.Multer.File): string {
    const extension =
      IMAGE_MIME_EXTENSIONS[file.mimetype] ||
      extname(file.originalname).toLowerCase();

    return `${Date.now()}-${randomUUID()}${extension}`;
  }
}
