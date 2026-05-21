import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';

type AdminUser = {
  userId: string;
};

@Roles('admin')
@Controller('admin/projects')
export class AdminProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectService.findAllAdmin(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectService.findOneAdmin(id);
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return this.projectService.publish(id);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.projectService.archive(id);
  }

  @Delete(':id')
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: AdminUser,
  ) {
    return this.projectService.softDelete(id, user.userId);
  }
}
