import { Column, BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word extends BaseEntity {
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
