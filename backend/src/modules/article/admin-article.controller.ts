import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';

type AdminUser = {
  userId: string;
};

@Roles('admin')
@Controller('admin/articles')
export class AdminArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query: ArticleQueryDto) {
    return this.articleService.findAllAdmin(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOneAdmin(id);
  }

  @Post()
  async create(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articleService.update(id, dto);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return this.articleService.publish(id);
  }

  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    return this.articleService.unpublish(id);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.articleService.archive(id);
  }

  @Delete(':id')
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: AdminUser,
  ) {
    return this.articleService.softDelete(id, user.userId);
  }
}
