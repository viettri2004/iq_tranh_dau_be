// src/modules/leaderboard/leaderboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from 'src/leaderboard/leaderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {}

  findAll(season = 'all_time') {
    return this.leaderboardRepository.find({
      where: { season },
      order: { elo: 'DESC' },
      take: 100,
      relations: ['user'],
    });
  }

  findByUser(userId: number, season = 'all_time') {
    return this.leaderboardRepository.findOne({
      where: { user: { id: userId }, season },
      relations: ['user'],
    });
  }
}
