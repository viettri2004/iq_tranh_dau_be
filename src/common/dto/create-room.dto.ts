import { Player } from '../types/player.interface';

export class CreateRoomDto {
  id: string | undefined;
  host!: Player;
}
