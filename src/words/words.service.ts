import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordRepository } from './words.repository';
import { CreateWordsDto } from './dto/create-words.dto';
import { Word } from './words.entity';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(WordRepository) private wordRepository: WordRepository,
  ) {}

  async createWord(createWordDto: CreateWordsDto): Promise<Word> {
    return await this.wordRepository.createWord(createWordDto);
  }
}
