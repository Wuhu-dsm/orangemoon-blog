import { createHash, randomInt, randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor, VisitorDocument } from './schemas/visitor.schema';

export type VisitorSession = {
  visitorId: string;
  nickname: string;
};

const NICKNAME_PREFIXES = [
  '云朵',
  '星光',
  '微风',
  '月白',
  '青柠',
  '晴空',
  '纸鹤',
  '薄荷',
];

@Injectable()
export class VisitorService {
  constructor(
    @InjectModel(Visitor.name)
    private readonly visitorModel: Model<VisitorDocument>,
  ) {}

  async createOrRefreshSession(
    visitorId: string | undefined,
    ip: string | undefined,
    userAgent: string | undefined,
  ): Promise<VisitorSession> {
    const safeVisitorId = visitorId || randomUUID();
    const now = new Date();
    const visitor = await this.visitorModel
      .findOneAndUpdate(
        { visitorId: safeVisitorId },
        {
          $set: {
            lastSeenAt: now,
            userAgentHash: this.hashValue(userAgent),
            lastIpHash: this.hashValue(ip),
          },
          $setOnInsert: {
            visitorId: safeVisitorId,
            nickname: this.generateNickname(),
            firstSeenAt: now,
          },
        },
        { new: true, upsert: true },
      )
      .exec();

    return {
      visitorId: visitor.visitorId,
      nickname: visitor.nickname,
    };
  }

  private generateNickname(): string {
    const prefix = NICKNAME_PREFIXES[randomInt(NICKNAME_PREFIXES.length)];
    const number = randomInt(100, 999);

    return `${prefix}${number}访客`;
  }

  private hashValue(value: string | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    return createHash('sha256').update(value).digest('hex');
  }
}
