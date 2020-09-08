import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { ISignInPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(credentialsDto: SignUpCredentialsDto): Promise<{ id: number }> {
    return await this.userRepository.signUp(credentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const email = await this.userRepository.validatePassword(
      signInCredentialsDto,
    );

    if (!email) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: ISignInPayload = { email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
