// src/modules/leaderboard/leaderboard.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Leaderboard } from 'src/leaderboard/leaderboard.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  async getPaginatedLeaderboard(
    page = 1,
    limit = 10,
  ): Promise<[User[], number]> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepo.findAndCount({
      order: { elo: 'DESC' },
      skip,
      take: limit,
    });
    return [users, total];
  }

  async getUserRankWithInfo(
    userId: number,
  ): Promise<{ user: User; rank_index: number }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const betterUsersCount = await this.userRepo.count({
      where: { elo: MoreThan(user.elo) },
    });

    return {
      user,
      rank_index: betterUsersCount + 1,
    };
  }
}
