import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsIn,
  IsOptional,
} from 'class-validator';
import { UserGroup } from '../user-group.enum';

export class CredentialsDto {
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

  @IsIn([UserGroup.ADMIN, UserGroup.FREE_USER])
  group: UserGroup;
}
