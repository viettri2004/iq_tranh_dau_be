import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from 'src/leaderboard/leaderboard.entity';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { LeaderboardController } from 'src/leaderboard/leaderboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
