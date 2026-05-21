import { mkdtemp, readFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { ConfigService } from '@nestjs/config';
import { UploadPurpose } from './dto/upload-purpose.dto';
import { UploadService } from './upload.service';

function createConfigService(uploadDir: string, maxFileSize = 1024) {
  return {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'upload.dir') {
        return uploadDir;
      }

      if (key === 'upload.maxFileSize') {
        return maxFileSize;
      }

      throw new Error(`Unexpected config key: ${key}`);
    }),
  } as unknown as ConfigService;
}

function createFile(
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File {
  const buffer = Buffer.from('png');

  return {
    fieldname: 'file',
    originalname: 'cover image.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: buffer.length,
    buffer,
    stream: undefined as never,
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  };
}

describe('UploadService', () => {
  let uploadDir: string;

  beforeEach(async () => {
    uploadDir = await mkdtemp(join(tmpdir(), 'sorablog-upload-'));
  });

  afterEach(async () => {
    await rm(uploadDir, { recursive: true, force: true });
  });

  it('stores images in purpose folders and returns a public uploads URL', async () => {
    const service = new UploadService(createConfigService(uploadDir));
    const result = await service.saveImage(
      createFile(),
      UploadPurpose.ArticleCover,
    );

    expect(result.url).toMatch(/^\/uploads\/article-cover\/.+\.png$/);
    expect(result.purpose).toBe(UploadPurpose.ArticleCover);

    const saved = await readFile(join(uploadDir, 'article-cover', result.filename));
    expect(saved.toString()).toBe('png');
  });

  it('rejects non-image MIME types', async () => {
    const service = new UploadService(createConfigService(uploadDir));

    await expect(
      service.saveImage(
        createFile({ mimetype: 'text/plain' }),
        UploadPurpose.Avatar,
      ),
    ).rejects.toThrow('Only image files are allowed');
  });
});
