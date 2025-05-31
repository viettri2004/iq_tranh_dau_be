import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from 'src/rooms/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly repo: Repository<Room>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['host_player', 'guest_player', 'match'],
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['host_player', 'guest_player', 'match'],
    });
  }

  create(data: Partial<Room>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<Room>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
