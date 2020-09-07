import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async signUp(
    @Body(ValidationPipe) credentialsDto: CredentialsDto,
  ): Promise<{ id: number }> {
    return await this.authService.signUp(credentialsDto);
  }
}
