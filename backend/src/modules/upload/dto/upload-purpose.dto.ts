import { IsEnum } from 'class-validator';

export enum UploadPurpose {
  Avatar = 'avatar',
  ArticleCover = 'article-cover',
  ArticleImage = 'article-image',
  GuestbookImage = 'guestbook-image',
  NoteImage = 'note-image',
  ProjectCover = 'project-cover',
  ProjectScreenshot = 'project-screenshot',
}

export class UploadPurposeDto {
  @IsEnum(UploadPurpose)
  purpose: UploadPurpose;
}
