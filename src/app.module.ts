import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ChallengesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
