import {
  Controller,
  Logger,
  Post,
  Put,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallenteDto } from './dto/create-challenge.dto';
import { Challenge } from './challenges.entity';
import { FilterChallengesDto } from './dto/filter-challenges.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  private logger = new Logger('ChallengesController');
  constructor(private challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallenteDto,
  ): Promise<Challenge> {
    this.logger.verbose(
      `Creating a new challenge: ${JSON.stringify(createChallengeDto)}`,
    );
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(
    @Query(ValidationPipe) filterChallengeDto: FilterChallengesDto,
  ): Promise<Challenge[]> {
    return await this.challengesService.getChallenges(filterChallengeDto);
  }

  @Get('/:id')
  async getChallengeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Challenge> {
    return await this.challengesService.getChallengeById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    this.logger.verbose(
      `Updating a challenge with id ${id}. New data: ${JSON.stringify(
        updateChallengeDto,
      )}`,
    );
    return await this.challengesService.updateChallenge(id, updateChallengeDto);
  }

  @Delete('/:id')
  async removeChallenge(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.verbose(`Removing a challenge with id ${id}`);
    await this.challengesService.removeChallenge(id);
  }
}
