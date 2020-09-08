import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { JwtStrategy } from '../jwt.strategy';
import { JwtService } from '@nestjs/jwt';

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

    service = await module.get<AuthService>(AuthService);
    repository = await module.get<UserRepository>(UserRepository);
    jwtService = await module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
