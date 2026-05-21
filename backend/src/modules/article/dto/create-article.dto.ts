import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '../../content/enums/content-status.enum';
import { BlockContentDto } from '../../content/dto/block-content.dto';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockContentDto)
  body?: BlockContentDto;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
