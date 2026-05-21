import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ProjectService } from './project.service';
import { ProjectQueryDto } from './dto/project-query.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Public()
  @Get()
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectService.findAllPublic(query);
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.projectService.findBySlugPublic(slug);
  }
}
