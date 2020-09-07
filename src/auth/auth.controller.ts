import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGroup } from './user-group.enum';
import { User } from './user.entity';
import { GetUser } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger('AuthController');

  @Post('/signup')
  @UseGuards(AuthGuard())
  async signUp(
    @Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto,
    @GetUser([UserGroup.ADMIN]) user: User,
  ): Promise<{ id: number }> {
    this.logger.verbose(
      `User ${user.email} is creating a new user ${signUpCredentialsDto.email}`,
    );
    return await this.authService.signUp(signUpCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) signinCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signinCredentialsDto);
  }
}
