import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller('articles')
export class ArticleController {
  @Public()
  @Get()
  findAll() {
    return [];
  }
}
