import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from '../challenges.controller';
import { ChallengesService } from '../challenges.service';
import { ChallengesRepository } from '../challenges.repository';
import { mockRepository, mockChallenges } from './challenges.mock';
import { CreateChallenteDto } from '../dto/create-challenge.dto';
import { User } from 'src/auth/user.entity';

describe('ChallengesController', () => {
  let controller: ChallengesController;
  let service: ChallengesService;
  let repository: ChallengesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [
        ChallengesService,
        { provide: ChallengesRepository, useFactory: mockRepository },
      ],
    }).compile();

    controller = await module.get<ChallengesController>(ChallengesController);
    service = await module.get<ChallengesService>(ChallengesService);
    repository = await module.get<ChallengesRepository>(ChallengesRepository);
  });

  describe('#ChallengesController', () => {
    describe('Name of the group', () => {
      describe('#createChallenge', () => {
        const createChallengeDto: CreateChallenteDto = {
          text: 'swipe',
          phonetic: 'swaɪp',
          ipa: 'aɪ',
          enphasized: 'ai',
          level: 1,
          trail: 1,
        };

        it('successfully create a new challenge', async () => {
          jest
            .spyOn(service, 'createChallenge')
            .mockResolvedValue(mockChallenges[0]);
          const result = await controller.createChallenge(
            createChallengeDto,
            new User(),
          );
          expect(result).toBe(mockChallenges[0]);
        });
      });
    });
  });
});
