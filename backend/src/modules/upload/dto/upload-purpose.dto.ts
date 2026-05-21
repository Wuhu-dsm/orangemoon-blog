import { IsEnum } from 'class-validator';

export enum UploadPurpose {
  Avatar = 'avatar',
  ArticleCover = 'article-cover',
  GuestbookImage = 'guestbook-image',
}

export class UploadPurposeDto {
  @IsEnum(UploadPurpose)
  purpose: UploadPurpose;
}
