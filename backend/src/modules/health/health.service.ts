import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ElasticsearchService } from '../../shared/elasticsearch/elasticsearch.service';
import { RedisService } from '../../shared/redis/redis.service';

type ServiceStatus = 'ok' | 'degraded';

export type HealthResponse = {
  status: ServiceStatus;
  services: {
    app: ServiceStatus;
    mongodb: ServiceStatus;
    redis: ServiceStatus;
    elasticsearch: ServiceStatus;
  };
};

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly redisService: RedisService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async check(): Promise<HealthResponse> {
    const services: HealthResponse['services'] = {
      app: 'ok',
      mongodb: this.connection.readyState === 1 ? 'ok' : 'degraded',
      redis: await this.checkRedis(),
      elasticsearch: await this.checkElasticsearch(),
    };
    const status = Object.values(services).every((value) => value === 'ok')
      ? 'ok'
      : 'degraded';

    return { status, services };
  }

  private async checkRedis(): Promise<ServiceStatus> {
    try {
      return (await this.redisService.getClient().ping()) === 'PONG'
        ? 'ok'
        : 'degraded';
    } catch {
      return 'degraded';
    }
  }

  private async checkElasticsearch(): Promise<ServiceStatus> {
    try {
      return (await this.elasticsearchService.ping()) ? 'ok' : 'degraded';
    } catch {
      return 'degraded';
    }
  }
}
