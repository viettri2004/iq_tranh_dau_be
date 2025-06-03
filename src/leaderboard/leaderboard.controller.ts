import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/common/dto/user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
export interface AuthRequest extends Request {
  user: {
    id: number;
    [key: string]: any;
  };
}
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

  @Get('rank')
  @ApiOperation({
    summary:
      '🥇 Trả về thông tin người dùng hiện tại và hạng trong bảng xếp hạng',
  })
  async getUserRank(@Req() req: AuthRequest) {
    const userId = req.user?.id;

    if (!userId) throw new UnauthorizedException();

    const { user, rank_index } =
      await this.leaderboardService.getUserRankWithInfo(userId);

    return {
      rank_index,
      user: plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
    };
  }
}
