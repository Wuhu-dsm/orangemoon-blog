import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class StatDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}

class SocialDto {
  @IsString()
  icon: string;

  @IsString()
  label: string;

  @IsString()
  href: string;
}

class ProfileDto {
  @IsString()
  nickname: string;

  @IsString()
  avatar: string;

  @IsString()
  title: string;

  @IsString()
  bio: string;

  @IsNumber()
  level: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats: StatDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialDto)
  socials: SocialDto[];
}

export class UpdateSettingDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  banners?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile?: ProfileDto;
}
