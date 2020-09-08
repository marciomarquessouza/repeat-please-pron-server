import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthController', () => {
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
    jwtService = await module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
