import { EntityRepository, Repository } from 'typeorm';
import { Challenge } from './challenges.entity';
import {
  Logger,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateChallenteDto } from './dto/create-challenge.dto';
import { FilterChallengesDto } from './dto/filter-challenges.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@EntityRepository(Challenge)
export class ChallengesRepository extends Repository<Challenge> {
  private logger = new Logger('ChallengesRepository');

  async createChallenge(
    createChallengeDto: CreateChallenteDto,
  ): Promise<Challenge> {
    const {
      text,
      phonetic,
      level,
      trail,
      enphasized,
      ipa,
    } = createChallengeDto;

    const challenge = new Challenge();
    challenge.text = text;
    challenge.phonetic = phonetic;
    challenge.ipa = ipa;
    challenge.enphasized = enphasized;
    challenge.level = level;
    challenge.trail = trail;

    try {
      await challenge.save();
      return challenge;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `This text already exists. Text: ${text}. Error: ${error.message}`,
        );
        throw new ConflictException(`This text (${text}) already exists`);
      }
      this.logger.error(
        `Error to create a new challenge. Data: ${JSON.stringify(
          createChallengeDto,
        )}. Error: ${error.code}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getChallenges(
    filterChallengesDto: FilterChallengesDto,
  ): Promise<Challenge[]> {
    const { search, limit, trail, level } = filterChallengesDto;
    const query = this.createQueryBuilder('challenge');

    if (level) {
      query.andWhere('challenge.level = :level', { level });
    }

    if (trail) {
      query.andWhere('challenge.trail = :trail', { trail });
    }

    if (search) {
      query.andWhere(
        'challenge.text LIKE :search OR challenge.phonetic LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (limit) {
      query.limit(limit);
    }

    try {
      return await query.getMany();
    } catch (error) {
      throw new BadRequestException(
        `Some parameter or data was not properly sent. Filter: ${JSON.stringify(
          filterChallengesDto,
        )}`,
      );
    }
  }

  async updateChallenge(
    id: number,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const challenge = await this.findOne(id);
    if (!challenge) {
      throw new BadRequestException(`Challenge with id ${id} doesn't exists`);
    }
    Object.keys(updateChallengeDto).map(key => {
      if (updateChallengeDto[key]) {
        challenge[key] = updateChallengeDto[key];
      }
    });

    try {
      await challenge.save();
      return challenge;
    } catch (error) {
      this.logger.error(
        `Error to create a new challenge. Data: ${JSON.stringify(
          updateChallengeDto,
        )}. Error: ${error.message}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
