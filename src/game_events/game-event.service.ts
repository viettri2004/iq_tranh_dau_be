// src/modules/game-event/game-event.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEvent } from 'src/game_events/game-event.entity';

@Injectable()
export class GameEventService {
  constructor(
    @InjectRepository(GameEvent)
    private readonly gameEventRepository: Repository<GameEvent>,
  ) {}

  findByUser(userId: number) {
    return this.gameEventRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  findByMatch(matchId: number) {
    return this.gameEventRepository.find({
      where: { match: { id: matchId } },
      order: { created_at: 'ASC' },
    });
  }

  create(data: Partial<GameEvent>) {
    return this.gameEventRepository.save(data);
  }
}
