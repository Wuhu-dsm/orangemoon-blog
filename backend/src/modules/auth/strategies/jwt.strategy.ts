import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

type JwtPayload = {
  sub: string;
  username: string;
  role: string;
  tokenVersion?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid token');
    }

    if ((user.refreshTokenVersion ?? 0) !== (payload.tokenVersion ?? 0)) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  }
}
