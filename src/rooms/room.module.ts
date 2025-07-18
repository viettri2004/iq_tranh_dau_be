import { MatchModule } from 'src/matches/match.module';
import { RoomService } from 'src/rooms/room.service';
import { RoomController } from 'src/rooms/room.controller';
import { RoomGateway } from 'src/gateways/room.gateway';
import { Room } from 'src/rooms/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), MatchModule],
  providers: [RoomService, RoomGateway],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
