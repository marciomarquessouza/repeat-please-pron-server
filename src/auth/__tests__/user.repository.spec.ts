import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import { TestingModule, Test } from '@nestjs/testing';
import { User } from '../user.entity';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const mockJwtService = () => ({
  sign: jest.fn(),
});

class ConflictError extends Error {
  constructor(private code: string, message: string) {
    super(message);
  }
}

describe('#UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  const signUpCredentialsDto: SignUpCredentialsDto = {
    email: 'marcio@rp.com',
    password: 'secret',
    name: 'Marcio',
  };

  describe('#signUp - when the sign up flow is called', () => {
    it('successfully create and save a new user', async () => {
      const user = new User();
      user.id = 9;
      user.save = jest.fn().mockResolvedValue({});
      jest.spyOn(repository, 'create').mockReturnValue(user);
      const result = await repository.signUp(signUpCredentialsDto);
      expect(result).toEqual({ id: 9 });
    });

    describe('when the user emails is already used', () => {
      it('throws a conflic expection', async () => {
        signUpCredentialsDto.name = null;
        const user = new User();
        user.email = 'marcio@rp.com';
        user.save = jest
          .fn()
          .mockRejectedValue(new ConflictError('23505', 'error'));

        jest.spyOn(repository, 'create').mockReturnValue(user);

        expect.assertions(2);
        try {
          await repository.signUp(signUpCredentialsDto);
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toBe(
            `Email "(${user.email})" is already in use`,
          );
        }
      });
    });

    describe('when an unexpected error occurs', () => {
      it('throws a internal serer error', async () => {
        const user = new User();
        user.email = 'marcio@rp.com';
        user.save = jest.fn().mockRejectedValue(new Error('error'));

        jest.spyOn(repository, 'create').mockReturnValue(user);

        expect.assertions(1);
        try {
          await repository.signUp(signUpCredentialsDto);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('#validatePassword - when the password is validated', () => {
    it('return true when the password is valid', async () => {
      const user = new User();
      user.email = 'marcio@rp.com';
      user.validatePassword = jest.fn().mockResolvedValue(true);
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      const result = await repository.validatePassword(signUpCredentialsDto);
      expect(result).toBe('marcio@rp.com');
    });

    it('return null when the password is invalid', async () => {
      const user = new User();
      user.email = 'marcio@rp.com';
      user.validatePassword = jest.fn().mockResolvedValue(false);
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      const result = await repository.validatePassword(signUpCredentialsDto);
      expect(result).toBe(null);
    });

    describe('when the user is not found', () => {
      it('throws a nout found exception', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);
        expect.assertions(2);

        try {
          await repository.validatePassword(signUpCredentialsDto);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(
            `User "${signUpCredentialsDto.email}" not found`,
          );
        }
      });
    });

    describe('when a unexpected error occurs', () => {
      it('throws an error message', async () => {
        const user = new User();
        user.email = 'marcio@rp.com';
        user.validatePassword = jest.fn().mockRejectedValue(new Error('error'));
        jest.spyOn(repository, 'findOne').mockResolvedValue(user);

        expect.assertions(2);
        try {
          await repository.validatePassword(signUpCredentialsDto);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('error');
        }
      });
    });
  });
});
