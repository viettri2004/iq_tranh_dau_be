import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchAnswer } from 'src/match-answers/match-answer.entity';
import { MatchAnswerService } from 'src/match-answers/match-answer.service';
import { MatchAnswerController } from 'src/match-answers/match-answer.controller';
import { Match } from 'src/matches/match.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Session } from 'src/sessions/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchAnswer, Match, User, Session]),
    AuthModule,
  ],
  providers: [MatchAnswerService],
  controllers: [MatchAnswerController],
  exports: [MatchAnswerService],
})
export class MatchAnswerModule {}
