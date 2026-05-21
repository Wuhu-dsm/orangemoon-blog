import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '../../content/enums/content-status.enum';
import { BlockContentDto } from '../../content/dto/block-content.dto';
import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
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
  screenshots?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsEnum(ProjectStatus)
  projectStatus?: ProjectStatus;

  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockContentDto)
  body?: BlockContentDto;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
