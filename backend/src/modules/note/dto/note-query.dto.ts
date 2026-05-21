import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentQueryDto } from '../../content/dto/content-query.dto';
import { NoteType } from '../enums/note-type.enum';

export class NoteQueryDto extends ContentQueryDto {
  @IsOptional()
  @IsEnum(NoteType)
  noteType?: NoteType;
}
