import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import { JwtStrategy } from '../jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { UnauthorizedException } from '@nestjs/common';

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        JwtStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('#signUp - when the sign up is started', () => {
    const signUpCredentialsDto: SignUpCredentialsDto = {
      email: 'marcio@rp.com',
      password: 'secret',
      name: 'Marcio',
    };

    it('calls the signUp flow with the right values', async () => {
      const spy = jest.spyOn(repository, 'signUp').mockResolvedValue({ id: 9 });

      await service.signUp(signUpCredentialsDto);
      expect(spy).toHaveBeenCalledWith(signUpCredentialsDto);
    });

    it('succesfully return the user id', async () => {
      jest.spyOn(repository, 'signUp').mockResolvedValue({ id: 9 });

      const result = await service.signUp(signUpCredentialsDto);
      expect(result).toEqual({ id: 9 });
    });
  });

  describe('#signIn - when te sign in is started', () => {
    const signInCredentialsDto: SignInCredentialsDto = {
      email: 'marcio@rp.com',
      password: 'secredt',
    };

    it('calls the SignIn flow with the right values', async () => {
      const spy = jest
        .spyOn(repository, 'validatePassword')
        .mockResolvedValue('marcio@rp.com');

      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      await service.signIn(signInCredentialsDto);

      expect(spy).toHaveBeenCalledWith(signInCredentialsDto);
    });

    it('successfully return the access token', async () => {
      jest
        .spyOn(repository, 'validatePassword')
        .mockResolvedValue('marcio@rp.com');

      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const response = await service.signIn(signInCredentialsDto);

      expect(response).toEqual({ accessToken: 'token' });
    });

    describe('when the password is not validated', () => {
      it('throw a unauthorized exception', async () => {
        jest.spyOn(repository, 'validatePassword').mockResolvedValue(null);

        expect.assertions(2);

        try {
          await service.signIn(signInCredentialsDto);
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe('Invalid Credentials');
        }
      });
    });
  });
});
