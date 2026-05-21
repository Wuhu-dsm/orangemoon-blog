import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

type SearchBody = Record<string, unknown>;
type SearchDocument = Record<string, unknown>;

@Injectable()
export class ElasticsearchService {
  constructor(private readonly esService: NestElasticsearchService) {}

  async indexDocument(index: string, id: string, document: SearchDocument) {
    return this.esService.index({ index, id, document });
  }

  async updateDocument(index: string, id: string, document: SearchDocument) {
    return this.esService.update({ index, id, doc: document });
  }

  async deleteDocument(index: string, id: string) {
    return this.esService.delete({ index, id });
  }

  async search(index: string, query: SearchBody) {
    return this.esService.search({ index, ...query });
  }

  async ping() {
    return this.esService.ping();
  }

  async createIndex(index: string, mappings: SearchBody) {
    const exists = await this.esService.indices.exists({ index });
    if (!exists) {
      await this.esService.indices.create({ index, mappings });
    }
  }
}
