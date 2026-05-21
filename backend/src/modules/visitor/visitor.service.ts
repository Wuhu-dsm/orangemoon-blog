import { createHash, randomInt, randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as geoip from 'geoip-lite';
import { Visitor, VisitorDocument } from './schemas/visitor.schema';

export type VisitorSession = {
  visitorId: string;
  nickname: string;
  city?: string;
};

const HISTORICAL_FIGURES = [
  // 三国
  '诸葛亮',
  '司马懿',
  '周瑜',
  '陆逊',
  '荀彧',
  '郭嘉',
  '庞统',
  '姜维',
  '赵云',
  '关羽',
  '张飞',
  '马超',
  '黄忠',
  '魏延',
  '张辽',
  '徐晃',
  '张郃',
  '于禁',
  '乐进',
  '邓艾',
  '钟会',
  '孙策',
  '孙权',
  '刘备',
  '曹操',
  '吕布',
  '貂蝉',
  '大乔',
  '小乔',
  '甄姬',
  '鲁肃',
  '吕蒙',
  '太史慈',
  '甘宁',
  '周泰',
  '程普',
  '黄盖',
  '韩当',
  '蒋钦',
  '陈武',
  // 两晋南北朝
  '王羲之',
  '谢安',
  '桓温',
  '祖逖',
  '嵇康',
  '阮籍',
  '山涛',
  '向秀',
  '刘伶',
  '王戎',
  '陶渊明',
  '谢灵运',
  '顾恺之',
  '王献之',
  '沈约',
  '江淹',
  '庾信',
  '徐陵',
  '阴铿',
  '裴松之',
  '范晔',
  '郦道元',
  '贾思勰',
  '祖冲之',
  '王导',
  '谢玄',
  '苻坚',
  '拓跋宏',
  '宇文邕',
  '高欢',
  '萧衍',
  '陈霸先',
  '刘裕',
  '司马炎',
  '左思',
  '潘岳',
  '陆机',
  '陆云',
  '孙绰',
  '许询',
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
    const uaHash = this.hashValue(userAgent);
    const ipHash = this.hashValue(ip);
    const geo = this.lookupGeo(ip);
    const now = new Date();

    let visitor: VisitorDocument | null = null;

    // 1. 优先用 visitorId 精确匹配
    if (visitorId) {
      visitor = await this.visitorModel.findOne({ visitorId }).exec();
    }

    // 2. 未找到 → 用指纹兜底（最近 30 天内相同 UA + IP）
    if (!visitor && uaHash && ipHash) {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      visitor = await this.visitorModel
        .findOne({
          userAgentHash: uaHash,
          lastIpHash: ipHash,
          lastSeenAt: { $gte: thirtyDaysAgo },
        })
        .exec();
    }

    // 3. 找到旧记录 → 更新
    if (visitor) {
      visitor.lastSeenAt = now;
      if (uaHash) visitor.userAgentHash = uaHash;
      if (ipHash) visitor.lastIpHash = ipHash;
      if (geo?.city) visitor.city = geo.city;
      await visitor.save();

      return {
        visitorId: visitor.visitorId,
        nickname: visitor.nickname,
        city: visitor.city,
      };
    }

    // 4. 新建访客
    const newVisitorId = visitorId || randomUUID();
    const newVisitor = await this.visitorModel.create({
      visitorId: newVisitorId,
      nickname: this.generateNickname(),
      firstSeenAt: now,
      lastSeenAt: now,
      userAgentHash: uaHash,
      lastIpHash: ipHash,
      city: geo?.city,
    });

    return {
      visitorId: newVisitor.visitorId,
      nickname: newVisitor.nickname,
      city: newVisitor.city,
    };
  }

  private generateNickname(): string {
    const name = HISTORICAL_FIGURES[randomInt(HISTORICAL_FIGURES.length)];
    const suffix = randomInt(10, 99);
    return `${name}·${suffix}`;
  }

  private hashValue(value: string | undefined): string | undefined {
    if (!value) {
      return undefined;
    }
    return createHash('sha256').update(value).digest('hex');
  }

  private lookupGeo(
    ip: string | undefined,
  ): { city?: string; country?: string } | null {
    if (!ip) {
      return null;
    }
    // 处理本地/内网 IP
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.')
    ) {
      return null;
    }
    const lookup = geoip.lookup(ip);
    if (!lookup) {
      return null;
    }
    return { city: lookup.city, country: lookup.country };
  }
}
