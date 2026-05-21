import { IsString, MinLength } from 'class-validator';

export class OwnerLoginDto {
  @IsString()
  usernameOrEmail: string;

  @IsString()
  @MinLength(6)
  password: string;
}
