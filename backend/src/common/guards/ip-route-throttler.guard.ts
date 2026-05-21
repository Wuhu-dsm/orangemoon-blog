import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

type RequestLike = {
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  method?: string;
  originalUrl?: string;
  url?: string;
  route?: {
    path?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
};

@Injectable()
export class IpRouteThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: RequestLike): Promise<string> {
    const forwardedFor = req.headers?.['x-forwarded-for'];
    const forwardedValue = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor;
    const forwardedIp = forwardedValue?.split(',')[0]?.trim();

    return (
      forwardedIp ?? req.ip ?? req.socket?.remoteAddress ?? 'unknown-visitor'
    );
  }

  protected generateKey(
    context: ExecutionContext,
    tracker: string,
    throttlerName: string,
  ): string {
    const request = context.switchToHttp().getRequest<RequestLike>();
    const route = [
      request.method ?? 'GET',
      request.route?.path ?? request.originalUrl?.split('?')[0] ?? request.url,
      throttlerName,
    ]
      .filter(Boolean)
      .join(':');

    return `throttle:${tracker}:${route}`;
  }
}
