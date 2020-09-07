import { IsOptional } from 'class-validator';

export class FilterChallengesDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  level?: number;

  @IsOptional()
  trail?: number;
}
