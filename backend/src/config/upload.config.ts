import { registerAs } from '@nestjs/config';

export const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export default registerAs('upload', () => ({
  dir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: Number.parseInt(
    process.env.MAX_FILE_SIZE ?? `${DEFAULT_MAX_FILE_SIZE_BYTES}`,
    10,
  ),
}));
