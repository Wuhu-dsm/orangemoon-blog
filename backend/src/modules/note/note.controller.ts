import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { NoteService } from './note.service';
import { NoteQueryDto } from './dto/note-query.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Public()
  @Get()
  async findAll(@Query() query: NoteQueryDto) {
    return this.noteService.findAllPublic(query);
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.noteService.findBySlugPublic(slug);
  }
}
