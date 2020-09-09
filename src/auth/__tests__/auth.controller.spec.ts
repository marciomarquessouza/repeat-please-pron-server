import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('#AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let repository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    repository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#signup', () => {
    it('calls the sign up flow', async () => {
      const signUpCredentialsDto: SignUpCredentialsDto = {
        email: 'marcio@rp.com',
        password: 'secret',
      };
      jest.spyOn(service, 'signUp').mockResolvedValue({ id: 9 });
      const result = await controller.signUp(signUpCredentialsDto);
      expect(result).toEqual({ id: 9 });
    });
  });

  describe('#signin', () => {
    it('calls the sign in flow ', async () => {
      const signinCredentialsDto: SignInCredentialsDto = {
        email: 'marcio@rp.com',
        password: 'secret',
      };

      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token' });
      const result = await controller.signIn(signinCredentialsDto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });
});
