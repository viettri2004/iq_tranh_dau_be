import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from 'src/leaderboard/leaderboard.entity';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { LeaderboardController } from 'src/leaderboard/leaderboard.controller';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/sessions/session.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Leaderboard, User]),
    AuthModule,
    SessionModule,
  ],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
