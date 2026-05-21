import { IsOptional, IsString, MaxLength } from 'class-validator';

export class VisitorSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  visitorId?: string;
}
