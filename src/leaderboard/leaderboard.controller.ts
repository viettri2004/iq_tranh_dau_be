import { Controller, Get, Param, Query } from '@nestjs/common';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getTop(@Query('season') season?: string) {
    return this.leaderboardService.findAll(season);
  }

  @Get(':userId')
  getUserRank(
    @Param('userId') userId: number,
    @Query('season') season?: string,
  ) {
    return this.leaderboardService.findByUser(userId, season);
  }
}
