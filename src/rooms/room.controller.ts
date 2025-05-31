import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RoomService } from 'src/rooms/room.service';
import { Room } from 'src/rooms/room.entity';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.roomService.findById(id);
  }

  @Post()
  create(@Body() room: Partial<Room>) {
    return this.roomService.create(room);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() room: Partial<Room>) {
    return this.roomService.update(id, room);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roomService.remove(id);
  }
}
