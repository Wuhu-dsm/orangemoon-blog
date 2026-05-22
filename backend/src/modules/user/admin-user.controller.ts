import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  AdminUpdateUserDto,
  AdminUserQueryDto,
} from './dto/admin-update-user.dto';
import { UserService } from './user.service';

@Roles('admin')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: AdminUserQueryDto) {
    return this.userService.findAllAdmin(query);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.userService.updateAdmin(id, dto);
  }
}
