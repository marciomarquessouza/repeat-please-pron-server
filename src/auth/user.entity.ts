import {
  Entity,
  BaseEntity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserGroup } from './user-group.enum';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  group: UserGroup;

  @Column()
  name?: string;

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === password;
  }
}
