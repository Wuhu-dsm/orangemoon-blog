import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpRouteThrottlerGuard } from './common/guards/ip-route-throttler.guard';
import { RolesGuard } from './common/guards/roles.guard';
import {
  databaseConfig,
  elasticsearchConfig,
  jwtConfig,
  rateLimitConfig,
  redisConfig,
  uploadConfig,
} from './config';
import { RATE_LIMIT_MESSAGE } from './config/rate-limit.config';
import { BullModule } from './shared/bull/bull.module';
import { ElasticsearchModule } from './shared/elasticsearch/elasticsearch.module';
import { RedisModule } from './shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticleModule } from './modules/article/article.module';
import { HealthModule } from './modules/health/health.module';
import { NoteModule } from './modules/note/note.module';
import { ProjectModule } from './modules/project/project.module';
import { SettingModule } from './modules/setting/setting.module';
import { UserModule } from './modules/user/user.module';
import { JwtAuthGuard } from './modules/auth/strategies/jwt-auth.guard';
import { UploadModule } from './modules/upload/upload.module';
import { VisitorModule } from './modules/visitor/visitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        redisConfig,
        elasticsearchConfig,
        jwtConfig,
        rateLimitConfig,
        uploadConfig,
      ],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        errorMessage: RATE_LIMIT_MESSAGE,
        throttlers: [
          {
            name: 'default',
            limit: configService.getOrThrow<number>('rateLimit.global.limit'),
            ttl: configService.getOrThrow<number>('rateLimit.global.ttl'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    ElasticsearchModule,
    BullModule,
    UserModule,
    AuthModule,
    VisitorModule,
    UploadModule,
    HealthModule,
    ArticleModule,
    NoteModule,
    ProjectModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: IpRouteThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
