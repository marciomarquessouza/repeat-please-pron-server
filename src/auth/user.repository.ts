import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { UserGroup } from './user-group.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<{ id: number }> {
    const { email, password, name } = signUpCredentialsDto;
    const user = this.create();
    user.email = email;
    user.group = UserGroup.FREE_USER;
    user.name = name || '';
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      return { id: user.id };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Email "(${user.email})" is already in use`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async validatePassword(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<string> {
    const { email, password } = signInCredentialsDto;
    const user = await this.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User "${email}" not found`);
    }
    try {
      const isPaswordValid = await user.validatePassword(password);

      return isPaswordValid ? user.email : null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
