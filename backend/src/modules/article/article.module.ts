import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ArticleController } from './article.controller';
import { AdminArticleController } from './admin-article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  controllers: [ArticleController, AdminArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
