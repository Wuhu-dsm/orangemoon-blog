import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentQueryDto } from '../../content/dto/content-query.dto';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectQueryDto extends ContentQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  projectStatus?: ProjectStatus;
}
