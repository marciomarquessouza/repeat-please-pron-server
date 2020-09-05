import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWordsDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  phonetic: string;

  @IsNotEmpty()
  ipa: string;

  @IsOptional()
  enphasized?: string;

  @IsNotEmpty()
  level: number;

  @IsOptional()
  trail?: number;

  @IsOptional()
  week?: number;
}
