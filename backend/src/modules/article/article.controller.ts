import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ArticleService } from './article.service';
import { ArticleQueryDto } from './dto/article-query.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Get()
  async findAll(@Query() query: ArticleQueryDto) {
    return this.articleService.findAllPublic(query);
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.articleService.findBySlugPublic(slug);
  }
}
