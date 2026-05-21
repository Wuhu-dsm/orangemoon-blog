import { Body, Controller, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { VisitorSessionDto } from './dto/visitor-session.dto';
import { VisitorService } from './visitor.service';

@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('session')
  async createSession(@Body() dto: VisitorSessionDto, @Req() request: Request) {
    return this.visitorService.createOrRefreshSession(
      dto.visitorId,
      request.ip,
      request.headers['user-agent'],
    );
  }
}
