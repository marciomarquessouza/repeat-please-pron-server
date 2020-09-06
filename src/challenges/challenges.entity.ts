import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['text'])
export class Challenge extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  phonetic: string;

  @Column()
  ipa: string;

  @Column()
  enphasized: string;

  @Column()
  level: number;

  @Column()
  trail: number;
}
