import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmailOrUsername(
      dto.email,
      dto.username,
    );

    if (existing) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
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

    return this.generateTokens(user);
  }

  private generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
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
}
