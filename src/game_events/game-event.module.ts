import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEvent } from 'src/game_events/game-event.entity';
import { GameEventService } from 'src/game_events/game-event.service';
import { GameEventController } from 'src/game_events/game-event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GameEvent])],
  providers: [GameEventService],
  controllers: [GameEventController],
  exports: [GameEventService],
})
export class GameEventModule {}
