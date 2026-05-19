import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule as NestBullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    NestBullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = new URL(configService.getOrThrow<string>('redis.url'));

        return {
          redis: {
            host: url.hostname,
            port: Number.parseInt(url.port, 10) || 6379,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestBullModule],
})
export class BullModule {}
