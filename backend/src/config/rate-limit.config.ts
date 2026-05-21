import { registerAs } from '@nestjs/config';

export const RATE_LIMIT_MESSAGE = '操作太频繁，请稍后再试';

export default registerAs('rateLimit', () => ({
  global: {
    limit: Number.parseInt(process.env.RATE_LIMIT_GLOBAL_LIMIT ?? '120', 10),
    ttl: Number.parseInt(process.env.RATE_LIMIT_GLOBAL_TTL_MS ?? '60000', 10),
  },
  sensitive: {
    limit: Number.parseInt(process.env.RATE_LIMIT_SENSITIVE_LIMIT ?? '12', 10),
    ttl: Number.parseInt(
      process.env.RATE_LIMIT_SENSITIVE_TTL_MS ?? '60000',
      10,
    ),
  },
}));
