import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { NoteController } from './note.controller';
import { AdminNoteController } from './admin-note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
    ]),
  ],
  controllers: [NoteController, AdminNoteController],
  providers: [NoteService],
})
export class NoteModule {}
