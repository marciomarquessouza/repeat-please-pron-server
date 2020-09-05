import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import { Word } from './words.entity';
import { CreateWordsDto } from './dto/create-words.dto';
import { WordService } from './words.service';
import { FilterWordsDto } from './dto/filter-words.dto';

@Controller('words')
export class WordsController {
  private logger = new Logger('WordsController');
  constructor(private wordService: WordService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createWord(@Body() createWordDto: CreateWordsDto): Promise<Word> {
    this.logger.verbose(
      `Creating a new word: ${JSON.stringify(createWordDto)}`,
    );
    return await this.wordService.createWord(createWordDto);
  }

  @Get()
  async getAllWords(
    @Query(ValidationPipe) filterWordsDto: FilterWordsDto,
  ): Promise<Word[]> {
    this.logger.verbose(
      `Retrieving all words. Filters: ${JSON.stringify(filterWordsDto)}`,
    );
    return this.wordService.getWords(filterWordsDto);
  }
}
