import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsIn,
  IsOptional,
} from 'class-validator';
import { UserGroup } from '../user-group.enum';

export class SignUpCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}
