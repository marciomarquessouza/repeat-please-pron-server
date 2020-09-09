import { JwtStrategy } from '../jwt.strategy';
import { TestingModule, Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('#validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const email = 'monkey@rp.com';
      const user = new User();
      user.email = email;

      const spy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await jwtStrategy.validate({ email });
      expect(spy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      expect.assertions(1);
      try {
        await jwtStrategy.validate({ email: 'marcio@rp.com' });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
