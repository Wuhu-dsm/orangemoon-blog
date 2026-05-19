import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserService } from './user.service';
import type { ProfileUpdate } from './user.service';

type AuthenticatedUser = {
  userId: string;
};

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.findById(user.userId);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: ProfileUpdate,
  ) {
    const { avatar, bio, location, website, socials } = data;

    return this.userService.updateProfile(user.userId, {
      avatar,
      bio,
      location,
      website,
      socials,
    });
  }
}
