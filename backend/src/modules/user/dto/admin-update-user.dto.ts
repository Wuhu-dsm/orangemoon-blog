import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum AdminUserRole {
  Admin = 'admin',
  User = 'user',
}

export enum AdminUserStatus {
  Active = 'active',
  Banned = 'banned',
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEnum(AdminUserStatus)
  status?: AdminUserStatus;

  @IsOptional()
  @IsEnum(AdminUserRole)
  role?: AdminUserRole;
}

export class AdminUserQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AdminUserStatus)
  status?: AdminUserStatus;

  @IsOptional()
  @IsEnum(AdminUserRole)
  role?: AdminUserRole;
}
