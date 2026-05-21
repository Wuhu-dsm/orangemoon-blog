import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import type { Request } from 'express';
import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { VisitorService } from '../visitor/visitor.service';
import { OwnerLoginDto } from './dto/owner-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

type AuthTokenPayload = {
  sub: string;
  username: string;
  role: string;
  tokenVersion: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly visitorService: VisitorService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: OwnerLoginDto) {
    const user = await this.userService.findByEmailOrUsername(
      dto.usernameOrEmail,
      dto.usernameOrEmail,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.assertOwner(user);
    await this.userService.touchLastLogin(user._id.toString());

    return this.generateAuthResponse(user);
  }

  async refresh(dto: RefreshTokenDto) {
    const secret = this.configService.getOrThrow<string>('jwt.secret');
    let payload: AuthTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AuthTokenPayload>(
        dto.refreshToken,
        { secret },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.assertOwner(user);

    if ((user.refreshTokenVersion ?? 0) !== payload.tokenVersion) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateAuthResponse(user);
  }

  async getMe(request: Request) {
    const authHeader = request.headers.authorization;

    // 尝试 JWT 认证
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const secret = this.configService.getOrThrow<string>('jwt.secret');
        const payload = await this.jwtService.verifyAsync<AuthTokenPayload>(
          token,
          { secret },
        );
        const user = await this.userService.findById(payload.sub);
        if (user && user.status === 'active') {
          return {
            type: 'user' as const,
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            level: user.level,
            exp: user.exp,
            bio: user.bio,
            location: user.location,
            website: user.website,
            socials: user.socials,
            status: user.status,
            lastLoginAt: user.lastLoginAt,
          };
        }
      } catch {
        // token 无效，继续走访客逻辑
      }
    }

    // 访客逻辑
    const visitorId = request.headers['x-visitor-id'] as string | undefined;
    const session = await this.visitorService.createOrRefreshSession(
      visitorId,
      request.ip,
      request.headers['user-agent'],
    );

    return {
      type: 'visitor' as const,
      visitorId: session.visitorId,
      nickname: session.nickname,
      city: session.city,
    };
  }

  private generateAuthResponse(user: UserDocument) {
    return {
      user: this.toSafeUser(user),
      ...this.generateTokens(user),
    };
  }

  private generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
      tokenVersion: user.refreshTokenVersion ?? 0,
    };
    const secret = this.configService.getOrThrow<string>('jwt.secret');

    return {
      accessToken: this.jwtService.sign(payload, {
        secret,
        expiresIn: this.configService.getOrThrow<string>(
          'jwt.expiresIn',
        ) as StringValue,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret,
        expiresIn: this.configService.getOrThrow<string>(
          'jwt.refreshExpiresIn',
        ) as StringValue,
      }),
    };
  }

  private assertOwner(user: UserDocument) {
    if (user.role !== 'admin' || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private toSafeUser(user: UserDocument) {
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      level: user.level,
      status: user.status,
    };
  }
}
