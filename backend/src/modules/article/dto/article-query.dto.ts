import { IsOptional, IsString } from 'class-validator';
import { ContentQueryDto } from '../../content/dto/content-query.dto';

export class ArticleQueryDto extends ContentQueryDto {
  @IsOptional()
  @IsString()
  category?: string;
}
