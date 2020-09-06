import {} from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateChallengeDto {
  @IsOptional()
  text: string;

  @IsOptional()
  phonetic: string;

  @IsOptional()
  ipa: string;

  @IsOptional()
  enphasized: string;

  @IsOptional()
  level: number;

  @IsOptional()
  trail: number;
}
