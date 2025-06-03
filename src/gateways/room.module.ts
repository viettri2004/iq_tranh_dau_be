import { forwardRef, Module } from '@nestjs/common';
import { RoomGateway } from 'src/gateways/room.gateway';
import { MatchModule } from 'src/matches/match.module';

import { RoomGateController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => MatchModule)],

  providers: [
    RoomGateway,
    UserService,
    {
      provide: 'MATCH_PROGRESS_MAP',
      useValue: new Map<string, { currentQuestion: number }>(),
    },
    {
      provide: 'MATCH_TIMERS_MAP',
      useValue: new Map<string, NodeJS.Timeout>(),
    },
    {
      provide: 'MATCH_ANSWER_TRACKER',
      useValue: new Map<string, Map<number, Set<number>>>(),
    },
  ],
  controllers: [RoomGateController],
  exports: [RoomGateway],
})
export class RoomModule {}
