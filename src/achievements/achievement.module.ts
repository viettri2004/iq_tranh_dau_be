import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/achievements/achievement.entity';
import { AchievementService } from 'src/achievements/achievement.service';
import { AchievementController } from 'src/achievements/achievement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  providers: [AchievementService],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
