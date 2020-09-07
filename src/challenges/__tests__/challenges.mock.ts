import { Challenge } from '../challenges.entity';

export const mockRepository = () => ({
  findOne: jest.fn(),
  remove: jest.fn(),
  getChallenges: jest.fn(),
  createChallenge: jest.fn(),
  updateChallenge: jest.fn(),
});

export const mockRepositoryMethods = {
  save: jest.fn(),
  hasId: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  recover: jest.fn(),
  reload: jest.fn(),
};

export const mockChallenges: Challenge[] = [
  {
    id: 1,
    text: 'swipe',
    phonetic: 'swaɪp',
    ipa: 'aɪ',
    enphasized: 'ai',
    level: 1,
    trail: 1,
    ...mockRepositoryMethods,
  },
  {
    id: 9,
    text: 'mother',
    phonetic: 'kɹiə',
    ipa: 'en',
    enphasized: 'or',
    level: 1,
    trail: 1,
    ...mockRepositoryMethods,
  },
];

export class ConflictError extends Error {
  constructor(private code: string, message: string) {
    super(message);
  }
}
