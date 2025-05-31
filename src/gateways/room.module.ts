import { forwardRef, Module } from '@nestjs/common';
import { RoomGateway } from 'src/gateways/room.gateway';
import { MatchModule } from 'src/matches/match.module';
import { UserModule } from 'src/users/user.module';
import { RoomGateController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    UserModule,
    forwardRef(() => MatchModule),
  ],

  providers: [
    RoomGateway,
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
