import { EntityRepository, Repository } from 'typeorm';
import { Word } from './words.entity';
import { CreateWordsDto } from './dto/create-words.dto';
import {
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FilterWordsDto } from './dto/filter-words.dto';

@EntityRepository(Word)
export class WordRepository extends Repository<Word> {
  private logger = new Logger('WordRepository');
  async createWord(createWordDto: CreateWordsDto): Promise<Word> {
    const {
      text,
      phonetic,
      ipa,
      enphasized,
      level,
      trail,
      week,
    } = createWordDto;

    const word = new Word();
    word.text = text;
    word.phonetic = phonetic;
    word.ipa = ipa;
    word.enphasized = enphasized;
    word.level = level;
    word.trail = trail;

    try {
      await word.save();
      return word;
    } catch (error) {
      this.logger.error(
        `Error to create a new word. Data: ${JSON.stringify(
          createWordDto,
        )}. Error: ${error.stack}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getWords(filterWordsDto: FilterWordsDto) {
    const { search, total, trail, level } = filterWordsDto;
    const query = this.createQueryBuilder('word');

    if (level) {
      query.andWhere('word.level = :level', { level });
    }

    if (trail) {
      query.andWhere('word.trail = :trail', { trail });
    }

    if (search) {
      query.andWhere('word.text LIKE :search OR word.phonetic LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (total) {
      query.limit(total);
    }

    try {
      return await query.getMany();
    } catch (error) {
      throw new BadRequestException(
        `Some parameter or data was not properly sent. Filter: ${JSON.stringify(
          filterWordsDto,
        )}`,
      );
    }
  }
}
