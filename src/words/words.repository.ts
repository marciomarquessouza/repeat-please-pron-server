import { EntityRepository, Repository } from 'typeorm';
import { Word } from './words.entity';
import { CreateWordsDto } from './dto/create-words.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';

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
    word.week = week;

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

  async getWords() {}
}
