import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/common/dto/user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: '📊 Lấy bảng xếp hạng với phân trang' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getLeaderboard(@Query('page') page = 1, @Query('limit') limit = 10) {
    const [users, total] =
      await this.leaderboardService.getPaginatedLeaderboard(
        Number(page),
        Number(limit),
      );
    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data: users.map(user =>
        plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
      ),
    };
  }
}
