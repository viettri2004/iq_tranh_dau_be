// src/modules/achievement/achievement.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from 'src/achievements/achievement.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {}

  findByUser(userId: number) {
    return this.achievementRepository.find({
      where: { user: { id: userId } },
      order: { unlocked_at: 'DESC' },
    });
  }

  create(data: Partial<Achievement>) {
    return this.achievementRepository.save(data);
  }

  remove(id: number) {
    return this.achievementRepository.delete(id);
  }
}
