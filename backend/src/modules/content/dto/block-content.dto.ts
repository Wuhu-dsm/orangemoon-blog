import { IsArray, IsOptional } from 'class-validator';

export class BlockContentDto {
  @IsOptional()
  @IsArray()
  blocks: unknown[];
}
