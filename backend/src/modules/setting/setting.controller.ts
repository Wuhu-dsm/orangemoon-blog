import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingService } from './setting.service';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Public()
  @Get()
  async find() {
    return this.settingService.find();
  }

  @Roles('admin')
  @Patch()
  async update(@Body() dto: UpdateSettingDto) {
    return this.settingService.update(dto);
  }
}
