import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from '../challenges.controller';
import { ChallengesService } from '../challenges.service';
import { ChallengesRepository } from '../challenges.repository';
import { mockRepository, mockChallenges } from './challenges.mock';
import { CreateChallenteDto } from '../dto/create-challenge.dto';
import { User } from '../../auth/user.entity';
import { FilterChallengesDto } from '../dto/filter-challenges.dto';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';

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

    describe('#getChallenges', () => {
      const filterChallengesDto: FilterChallengesDto = {
        search: 'swipe',
      };

      it('return all challenges', async () => {
        jest.spyOn(service, 'getChallenges').mockResolvedValue(mockChallenges);
        const result = await controller.getChallenges(filterChallengesDto);
        expect(result).toBe(mockChallenges);
      });
    });

    describe('#getChallengeById', () => {
      const id = 9;

      it('return a challenge by id', async () => {
        jest
          .spyOn(service, 'getChallengeById')
          .mockResolvedValue(mockChallenges[0]);
        const result = await controller.getChallengeById(id);
        expect(result).toBe(mockChallenges[0]);
      });
    });

    describe('#updateChallenge', () => {
      const id = 9;
      const updateChallengeDto: UpdateChallengeDto = {
        text: 'task',
      };

      it('successfully update the challenge', async () => {
        jest
          .spyOn(service, 'updateChallenge')
          .mockResolvedValue(mockChallenges[0]);
        const result = await controller.updateChallenge(
          id,
          updateChallengeDto,
          new User(),
        );
        expect(result).toBe(mockChallenges[0]);
      });
    });

    describe('#removeChallenge', () => {
      const id = 9;

      it('successfully remove the challenge', async () => {
        const spy = jest.spyOn(service, 'removeChallenge').mockResolvedValue();
        await controller.removeChallenge(id, new User());
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
