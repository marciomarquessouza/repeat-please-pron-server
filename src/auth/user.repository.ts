import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(credentialsDto: CredentialsDto): Promise<{ id: number }> {
    const { email, password, group, name } = credentialsDto;
    const user = new User();
    user.email = email;
    user.group = group;
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

  async validatePassword(credentialsDto: CredentialsDto): Promise<string> {
    const { email, password } = credentialsDto;
    try {
      const user = await this.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException(`User "${email}" not found`);
      }
      const isPaswordValid = await user.validatePassword(password);

      return isPaswordValid ? user.email : null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
