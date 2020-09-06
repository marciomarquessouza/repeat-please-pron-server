import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesRepository } from './challenges.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengesRepository])],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
