import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordRepository } from './words.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WordRepository])],
  controllers: [WordsController],
  providers: [WordService],
})
export class WordsModule {}
