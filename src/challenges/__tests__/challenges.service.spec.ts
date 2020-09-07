import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from '../challenges.service';
import { ChallengesRepository } from '../challenges.repository';
import { FilterChallengesDto } from '../dto/filter-challenges.dto';
import {
  mockRepository,
  mockChallenges,
  mockRepositoryMethods,
} from './challenges.mock';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChallenteDto } from '../dto/create-challenge.dto';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';

describe('#ChallengesService', () => {
  let service: ChallengesService;
  let repository: ChallengesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        { provide: ChallengesRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = await module.get<ChallengesService>(ChallengesService);
    repository = await module.get<ChallengesRepository>(ChallengesRepository);
  });

  describe('#getChallenges - when get all challenges', () => {
    const filterChallengesDto: FilterChallengesDto = {
      search: 'something',
      limit: 10,
      level: 1,
      trail: 1,
    };

    it('sent the corret parameters', async () => {
      const spy = jest.spyOn(repository, 'getChallenges');
      await service.getChallenges(filterChallengesDto);
      expect(spy).toHaveBeenCalledWith(filterChallengesDto);
    });

    it('return challenges properly', async () => {
      jest.spyOn(repository, 'getChallenges').mockResolvedValue(mockChallenges);
      const response = await repository.getChallenges(filterChallengesDto);
      expect(response).toBe(mockChallenges);
    });
  });

  describe('#getChallengeById - when get a challenge by id', () => {
    const id = 9;
    it('is called with correct parameters', async () => {
      const spy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockChallenges[0]);
      await service.getChallengeById(id);
      expect(spy).toHaveBeenCalledWith({ id });
    });

    it('returns the correct challenge value', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockChallenges[0]);
      const response = await service.getChallengeById(id);
      expect(response).toBe(mockChallenges[0]);
    });

    describe('when the challenge id does not exists', () => {
      it('throw a not found exceptions', async () => {
        jest.spyOn(repository, 'findOne');
        expect.assertions(2);
        try {
          await service.getChallengeById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(`Challenge with id: ${id} doesn't exists`);
        }
      });
    });
  });

  describe('#createChallenge - when a new challenge is created', () => {
    const createChallengeDto: CreateChallenteDto = {
      text: 'swipe',
      phonetic: 'swaɪp',
      ipa: 'aɪ',
      enphasized: 'ai',
      level: 1,
      trail: 1,
    };

    it('is called properly', async () => {
      const spy = jest.spyOn(repository, 'createChallenge');
      await service.createChallenge(createChallengeDto);
      expect(spy).toHaveBeenCalledWith(createChallengeDto);
    });

    it('return the challenge created', async () => {
      jest
        .spyOn(repository, 'createChallenge')
        .mockResolvedValue(mockChallenges[0]);
      const resolve = await service.createChallenge(createChallengeDto);
      expect(resolve).toBe(mockChallenges[0]);
    });
  });

  describe('#removeChallenge - when a challenge is removed', () => {
    const id = 9;
    it('is called properly', async () => {
      jest
        .spyOn(service, 'getChallengeById')
        .mockResolvedValue(mockChallenges[0]);
      const spy = jest.spyOn(repository, 'remove');
      await service.removeChallenge(id);
      expect(spy).toHaveBeenCalledWith(mockChallenges[0]);
    });

    it('throws a error if the challenge does not exists', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'getChallengeById')
        .mockRejectedValue(
          new NotFoundException(`Challenge with id: ${id} doesn't exists`),
        );
      try {
        await service.removeChallenge(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Challenge with id: ${id} doesn't exists`);
      }
    });

    it('throws a error case the remove process fails', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'getChallengeById')
        .mockResolvedValue(mockChallenges[0]);
      jest
        .spyOn(repository, 'remove')
        .mockRejectedValue(new Error('unexpected error'));
      try {
        await service.removeChallenge(id);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe(
          `Internal error removing the challenge with id ${id}`,
        );
      }
    });
  });

  describe('#updateChallenge - when a challenge is updated', () => {
    const id = 9;
    const updateChallengeDto: UpdateChallengeDto = {
      text: 'swipes',
    };

    it('is called properly', async () => {
      const spy = jest.spyOn(repository, 'updateChallenge');
      await service.updateChallenge(id, updateChallengeDto);
      expect(spy).toHaveBeenCalledWith(id, updateChallengeDto);
    });

    it('return the challenge updated', async () => {
      const mockChallengeUpdated = {
        ...mockChallenges[0],
        ...mockRepositoryMethods,
        text: 'swipes',
      };
      jest
        .spyOn(repository, 'updateChallenge')
        .mockResolvedValue(mockChallengeUpdated);
      const response = await service.updateChallenge(id, updateChallengeDto);
      expect(response).toBe(mockChallengeUpdated);
    });
  });
});
