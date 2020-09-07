import { ChallengesRepository } from '../challenges.repository';
import { TestingModule, Test } from '@nestjs/testing';
import {
  mockChallenges,
  mockRepositoryMethods,
  ConflictError,
} from './challenges.mock';
import { CreateChallenteDto } from '../dto/create-challenge.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilterChallengesDto } from '../dto/filter-challenges.dto';

describe('ChallengesRepository', () => {
  let repository: ChallengesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengesRepository],
    }).compile();

    repository = await module.get<ChallengesRepository>(ChallengesRepository);
  });

  describe('#ChallengesRepository', () => {
    describe('#createChallenge - when a challenge is created', () => {
      const createChallengeDto: CreateChallenteDto = {
        text: 'swipe',
        phonetic: 'swaɪp',
        ipa: 'aɪ',
        enphasized: 'ai',
        level: 1,
        trail: 1,
      };

      it('successfully creates a new challenge', async () => {
        const spy = jest
          .spyOn(repository, 'create')
          .mockReturnValue(mockChallenges[0]);
        await repository.createChallenge(createChallengeDto);
        expect(spy).toHaveBeenCalled();
      });

      it('returns the challenge values properly', async () => {
        jest.spyOn(repository, 'create').mockReturnValue(mockChallenges[0]);
        const result = await repository.createChallenge(createChallengeDto);
        expect(result).toBe(mockChallenges[0]);
      });

      describe('when the text challenge already exists', () => {
        it('throws a conflict exception', async () => {
          const mockChallengeWithError = {
            ...mockChallenges[0],
            ...mockRepositoryMethods,
            save: jest
              .fn()
              .mockRejectedValue(new ConflictError('23505', 'Conflict')),
          };

          jest
            .spyOn(repository, 'create')
            .mockReturnValue(mockChallengeWithError);

          expect.assertions(2);
          try {
            await repository.createChallenge(createChallengeDto);
          } catch (error) {
            expect(error).toBeInstanceOf(ConflictException);
            expect(error.message).toBe(
              `This text (${mockChallengeWithError.text}) already exists`,
            );
          }
        });
      });

      describe('when exists a unexpected fail', () => {
        it('throws a internal server error', async () => {
          const mockChallengeWithError = {
            ...mockChallenges[0],
            ...mockRepositoryMethods,
            save: jest.fn().mockRejectedValue(new Error('Unexpected Error')),
          };

          jest
            .spyOn(repository, 'create')
            .mockReturnValue(mockChallengeWithError);

          expect.assertions(1);
          try {
            await repository.createChallenge(createChallengeDto);
          } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
          }
        });
      });
    });
  });

  describe('#getChallenges - when get challenges', () => {
    beforeEach(() => {
      const getMany = jest.fn();
      const andWhere = jest.fn(() => ({ getMany }));
      const limit = jest.fn(() => ({ getMany }));
      // @ts-ignore
      repository.createQueryBuilder = jest.fn(() => ({
        getMany,
        andWhere,
        limit,
      }));
    });
    const filterChallengesDto: FilterChallengesDto = {
      search: 'task',
      level: 1,
      trail: 1,
      limit: 10,
    };

    it('get all tasks from repository', async () => {
      await repository.getChallenges(filterChallengesDto);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
