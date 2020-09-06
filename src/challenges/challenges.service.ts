import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengesRepository } from './challenges.repository';
import { CreateChallenteDto } from './dto/create-challenge.dto';
import { Challenge } from './challenges.entity';
import { FilterChallengesDto } from './dto/filter-challenges.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(ChallengesRepository)
    private challengeRepository: ChallengesRepository,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallenteDto,
  ): Promise<Challenge> {
    return await this.challengeRepository.createChallenge(createChallengeDto);
  }

  async getChallenges(
    filterChallengesDto: FilterChallengesDto,
  ): Promise<Challenge[]> {
    return await this.challengeRepository.getChallenges(filterChallengesDto);
  }

  async getChallengeById(id: number): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOne({ where: { id } });
    if (!challenge) {
      throw new BadRequestException(`Challenge with id: ${id} doesn't exists`);
    }
    return challenge;
  }

  async updateChallenge(
    id: number,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengeRepository.updateChallenge(
      id,
      updateChallengeDto,
    );
  }

  async removeChallenge(id: number): Promise<void> {
    try {
      const challenge = await this.getChallengeById(id);
      await this.challengeRepository.remove(challenge);
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal error removing the challenge with id ${id}`,
      );
    }
  }
}
