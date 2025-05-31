import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AchievementService } from 'src/achievements/achievement.service';
import { Achievement } from 'src/achievements/achievement.entity';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get('user/:userId')
  getUserAchievements(@Param('userId') userId: number) {
    return this.achievementService.findByUser(userId);
  }

  @Post()
  create(@Body() data: Partial<Achievement>) {
    return this.achievementService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.achievementService.remove(id);
  }
}
