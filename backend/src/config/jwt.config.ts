import { registerAs } from '@nestjs/config';

const PLACEHOLDER_SECRET_FRAGMENTS = [
  'default-secret',
  'change-me',
  'change_me',
  'changeme',
  'replace-with',
];

export default registerAs('jwt', () => ({
  secret: resolveJwtSecret(),
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}));

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'development') {
    return secret || 'default-secret';
  }

  if (!secret || isPlaceholderSecret(secret)) {
    throw new Error(
      'JWT_SECRET must be set to a strong non-placeholder value outside development.',
    );
  }

  return secret;
}

function isPlaceholderSecret(secret: string): boolean {
  const normalized = secret.trim().toLowerCase();

  return PLACEHOLDER_SECRET_FRAGMENTS.some((fragment) =>
    normalized.includes(fragment),
  );
}
