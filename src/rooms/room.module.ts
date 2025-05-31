import { MatchModule } from 'src/matches/match.module';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomGateway } from 'src/gateways/room.gateway';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), MatchModule],
  providers: [RoomService, RoomGateway],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
