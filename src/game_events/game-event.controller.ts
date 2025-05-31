import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameEventService } from 'src/game_events/game-event.service';
import { GameEvent } from 'src/game_events/game-event.entity';

@Controller('game-events')
export class GameEventController {
  constructor(private readonly gameEventService: GameEventService) {}

  @Get('user/:userId')
  getUserEvents(@Param('userId') userId: number) {
    return this.gameEventService.findByUser(userId);
  }

  @Get('match/:matchId')
  getMatchEvents(@Param('matchId') matchId: number) {
    return this.gameEventService.findByMatch(matchId);
  }

  @Post()
  create(@Body() data: Partial<GameEvent>) {
    return this.gameEventService.create(data);
  }
}
