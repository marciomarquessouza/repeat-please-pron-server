import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from '../challenges.controller';

describe('ChallengesController', () => {
  let controller: ChallengesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
    }).compile();

    controller = await module.get<ChallengesController>(ChallengesController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
