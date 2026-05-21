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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';

type AdminUser = {
  userId: string;
};

@Roles('admin')
@Controller('admin/notes')
export class AdminNoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async findAll(@Query() query: NoteQueryDto) {
    return this.noteService.findAllAdmin(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noteService.findOneAdmin(id);
  }

  @Post()
  async create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.noteService.update(id, dto);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return this.noteService.publish(id);
  }

  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    return this.noteService.unpublish(id);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.noteService.archive(id);
  }

  @Delete(':id')
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: AdminUser,
  ) {
    return this.noteService.softDelete(id, user.userId);
  }
}
