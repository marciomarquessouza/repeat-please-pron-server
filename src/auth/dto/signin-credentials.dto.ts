import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignInCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
