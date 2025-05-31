import { Module, forwardRef } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { User } from 'src/users/user.entity';
import { RoomModule } from 'src/gateways/room.module';
import { MatchAnswer } from 'src/match-answers/match-answer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/sessions/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, User, MatchAnswer]),
    forwardRef(() => RoomModule), // ✅ cũng cần forwardRef ở đây
    AuthModule,
    SessionModule,
  ],
  providers: [MatchService],
  controllers: [MatchController],
  exports: [MatchService],
})
export class MatchModule {}
