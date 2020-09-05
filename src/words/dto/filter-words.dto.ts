import { IsOptional } from 'class-validator';
import { TreeLevelColumn } from 'typeorm';

export class FilterWordsDto {
  @IsOptional()
  search: string;

  @IsOptional()
  total: number;

  @IsOptional()
  level: number;

  @IsOptional()
  trail: number;
}
